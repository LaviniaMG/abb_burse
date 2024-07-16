const express = require('express');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const router = express.Router();
const { solicitari, tipBursa } = require('../models'); // Importă modelele Sequelize

const folderPath = path.join(__dirname, '../');

// Funcție pentru evaluarea cererilor de concurs
function evaluateApplication(text) {
    const points = {
        invatatura: 0,
        cercetareStiintifica: 0
    };

    console.log(`Text extras din PDF: ${text}`);

    // Criteriul 1: Rezultate la învăţătură
    const mediaPattern = /Media\s*:\s*(\d+\.\d+)/;
    const mediaMatch = text.match(mediaPattern);
    const media = mediaMatch ? parseFloat(mediaMatch[1]) : null;
    console.log(`Evaluating media: ${media}`);
    if (media !== null && !isNaN(media) && media >= 9 && media <= 10) {
        points.invatatura = Math.round((media - 9) * 10);
        if (media === 10) {
            points.invatatura += 40;
        }
    }

    // Criteriul 2: Cercetare ştiinţifică
    const researchContractsPattern = /contract de cercetare naţională sau internaţională/gi;
    const scientificSessionPattern = /Premiul\s(I|II|III|Menţiune)/gi;
    const publicationPattern = /publicare\sde\sarticole\sin\sreviste\scu\sISSN/gi;
    const bookPattern = /publicare\sde\scărţi\sde\sspecialitate/gi;

    points.cercetareStiintifica += (text.match(researchContractsPattern) || []).length * 7;
    const scientificSessions = text.match(scientificSessionPattern) || [];
    scientificSessions.forEach(session => {
        if (/Premiul\sI/gi.test(session)) {
            points.cercetareStiintifica += 5;
        } else if (/Premiul\sII/gi.test(session)) {
            points.cercetareStiintifica += 4;
        } else if (/Premiul\sIII/gi.test(session)) {
            points.cercetareStiintifica += 3;
        } else if (/Menţiune/gi.test(session)) {
            points.cercetareStiintifica += 2;
        } else {
            points.cercetareStiintifica += 1;
        }
    });
    points.cercetareStiintifica += (text.match(publicationPattern) || []).length * 10;
    points.cercetareStiintifica += (text.match(bookPattern) || []).length * 20;

    const totalPoints = points.invatatura + points.cercetareStiintifica;
    return { points, totalPoints };
}

// Funcție pentru procesarea fișierelor PDF
async function processPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    return evaluateApplication(text);
}

// Ruta GET pentru a procesa toate fișierele PDF dintr-un folder
router.get('/', async (req, res) => {
    try {
        const bursa = await tipBursa.findOne({ where: { idBursa: 4 } });
        if (!bursa) {
            return res.status(404).send({ message: 'Bursa nu a fost găsită' });
        }

        const solicitariBursa = await solicitari.findAll({ where: { idBursa: 4 } });
        if (solicitariBursa.length === 0) {
            return res.status(404).send({ message: 'No solicitations found for this bursa' });
        }

        let processedFiles = [];
        for (const solicitare of solicitariBursa) {
            const file = solicitare.DocumentURL;
            const fullPath = path.join(folderPath, file);

            console.log(`Verifying existence of file at path: ${fullPath}`);

            if (fs.existsSync(fullPath)) {
                try {
                    const { points, totalPoints } = await processPDF(fullPath);
                    processedFiles.push({ file, points, totalPoints });
                } catch (fileError) {
                    console.error(`Eroare la procesarea fișierului ${file}:`, fileError);
                }
            } else {
                console.warn(`File ${fullPath} not found in directory`);
            }
        }

        if (processedFiles.length === 0) {
            return res.status(404).send({ message: 'No valid PDF files found for processing' });
        }

        processedFiles.sort((a, b) => b.totalPoints - a.totalPoints);

        let nrBursieri = 0;
        let updates = 0;
        for (const fileData of processedFiles) {
            let finalStatus = 2;
            if (nrBursieri < bursa.nrBursieri) {
                finalStatus = 1;
                nrBursieri++;
            }

            const [updated] = await solicitari.update(
                { idStatus: finalStatus },
                { where: { DocumentURL: fileData.file, idBursa: 4 } }
            );

            if (updated > 0) {
                updates++;
            } else {
                console.warn(`Document ${fileData.file} nu a fost găsit în tabelul solicitari`);
            }
        }

        if (updates > 0) {
            res.status(200).send({ message: 'Solicitările au fost actualizate cu succes.' });
        } else {
            res.status(200).send({ message: 'Nicio solicitare nu a fost actualizată.' });
        }
    } catch (error) {
        console.error('Error processing PDF files:', error);
        res.status(500).send({ error: 'Error processing PDF files', details: error.message });
    }
});

module.exports = router;