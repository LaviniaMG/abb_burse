const express = require('express');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const router = express.Router();
const { solicitari, tipBursa } = require('../models'); // Importă modelele Sequelize
//rez remarcabilr
const folderPath = path.join(__dirname, '../');

function evaluateApplication(text) {
    const points = {
        invatatura: 0,
        activitateCulturalaArtistica: 0,
        activitateOrganizatorica: 0
    };

    console.log(`Text extras din PDF: ${text}`);

    // Criteriul 1: Rezultate la învăţătură
    const mediaPattern = /Media\s*:\s*(\d+\.\d+)/;
    const mediaMatch = text.match(mediaPattern);
    const media = mediaMatch ? parseFloat(mediaMatch[1]) : null;
    console.log(`Evaluating media: ${media}`);
    if (media !== null && !isNaN(media) && media >= 8 && media <= 10) {
        points.invatatura = Math.round((media - 8) * 10); // Regula de trei simplă pentru media între 8 și 10
        if (media === 10) {
            points.invatatura += 40; // Bonus pentru media 10 (zece)
        }
    }

    // Criteriul 2: Activitate cultural-artistică
    const culturalPatterns = [
        { regex: /premiul\sI\s*–\s*(\d+)\spuncte/gi, points: 5 },
        { regex: /premiul\sII\s*–\s*(\d+)\spuncte/gi, points: 4 },
        { regex: /premiul\sIII\s*–\s*(\d+)\spuncte/gi, points: 3 },
        { regex: /menţiune\s*–\s*(\d+)\spuncte/gi, points: 2 },
        { regex: /participare\s*–\s*(\d+)\spuncte/gi, points: 1 }
    ];

    culturalPatterns.forEach(pattern => {
        const matches = text.match(pattern.regex) || [];
        points.activitateCulturalaArtistica += matches.length * pattern.points;
    });

    // Criteriul 3: Activitate organizatorică
    const organizatorPatterns = [
        { regex: /coordonator\s*–\s*(\d+)\spuncte/gi, points: 5 },
        { regex: /membru\s*–\s*(\d+)\spuncte/gi, points: 3 },
        { regex: /participant\s*–\s*(\d+)\spuncte/gi, points: 1 }
    ];

    organizatorPatterns.forEach(pattern => {
        const matches = text.match(pattern.regex) || [];
        points.activitateOrganizatorica += matches.length * pattern.points;
    });

    const totalPoints = points.invatatura + points.activitateCulturalaArtistica + points.activitateOrganizatorica;
    return { points, totalPoints };
}

async function processPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    return evaluateApplication(text);
}

router.get('/', async (req, res) => {
    try {
        const bursa = await tipBursa.findOne({ where: { idBursa: 8 } });
        if (!bursa) {
            return res.status(404).send({ message: 'Bursa nu a fost găsită' });
        }

        const solicitariBursa = await solicitari.findAll({ where: { idBursa: 8 } });
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
                { where: { DocumentURL: fileData.file, idBursa: 8 } }
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
