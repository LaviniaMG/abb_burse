const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const xlsx = require('xlsx');
const { student, utilizator, facultate, solicitari, tipBursa } = require('../models');

const router = express.Router();

// Verifică și creează directorul dacă nu există
const uploadDir = path.join(__dirname, '../uploads-students/bursa-perf-studiu');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Directory created:', uploadDir);
}

// Configurarea multer pentru stocarea fișierelor
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir); // Specifică directorul unde să fie salvat fișierul
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Păstrează numele original al fișierului
    }
});

const upload = multer({ storage: storage }).single('file');

// Ruta POST pentru încărcarea și procesarea fișierului CSV sau XLSX
router.post('/', (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: "Multer error: " + err.message });
        } else if (err) {
            return res.status(500).json({ message: "Upload error: " + err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        console.log('File uploaded successfully:', req.file.path);

        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        if (fileExtension === '.csv') {
            processCSVFile(req, res); // Procesează fișierul CSV
        } else if (fileExtension === '.xlsx') {
            processXLSXFile(req, res); // Procesează fișierul XLSX
        } else {
            res.status(400).send({ message: 'Unsupported file format' });
        }
    });
});

function processCSVFile(req, res) {
    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => processData(results, res));
}

function processXLSXFile(req, res) {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    processData(jsonData, res);
}

async function processData(data, res) {
    try {
        const tipBursa1 = await tipBursa.findOne({ where: { idBursa: 3 } });
        console.log('bursa', tipBursa1.denumire);
        let nrBursieriAlocati = 0;

        for (const studentData of data) {
            console.log('studentData:', studentData);

            if (parseFloat(studentData.media) >= 5 &&
                parseInt(studentData.restanta) === 0 && nrBursieriAlocati < tipBursa1.nrBursieri) {

                const faculty = await facultate.findOne({
                    where: {
                        facultate: studentData.Facultate,
                        specializare: studentData.Specializare
                    }
                });

                const hashedPassword = bcrypt.hashSync(studentData.Parola, 10);
                const cnpAsString = studentData.CNP.toString();
                
                const [utilizatorRecord, created] = await utilizator.findOrCreate({
                    where: { CNP: cnpAsString },
                    defaults: {
                        Nume: studentData.Nume,
                        Prenume: studentData.Prenume,
                        InitialaTata: studentData.InitialaTata,
                        Email: studentData.Email,
                        Telefon: studentData.Telefon,
                        CNP: cnpAsString,
                        Parola: hashedPassword,
                        idTipUtilizator: 2
                    }
                });

                console.log('utilizatorRecord:', utilizatorRecord);

                const [studentRecord, studentCreated] = await student.findOrCreate({
                    where: { idUtilizator: utilizatorRecord.idUtilizator },
                    defaults: {
                        idUtilizator: utilizatorRecord.idUtilizator,
                        idFacultate: faculty.id,
                        anFacultate: studentData.anFacultate,
                        media: studentData.media,
                        restanta: false,
                    }
                });

                console.log('studentRecord:', studentRecord);

                await solicitari.findOrCreate({
                    where: {
                        idUtilizator: utilizatorRecord.idUtilizator,
                        idStatus: 1,
                        denumireBursa: "Bursă de Performanță pentru Studiu",
                        idBursa: 1
                    },
                    defaults: {
                        idUtilizator: utilizatorRecord.idUtilizator,
                        idStatus: 1,
                        DocumentURL: 'excel',
                        denumireBursa: "Bursă de Performanță pentru Studiu",
                        idBursa: 3
                    }
                });

                console.log('solicitari:', solicitari);
                nrBursieriAlocati++;
            }
        }

        console.log('nrBursieriAlocati:', nrBursieriAlocati);
        res.send({ message: 'Datele au fost procesate și salvate cu succes.' });
    } catch (err) {
        console.error('Eroare la procesarea datelor: ', err);
        res.status(500).send({ message: 'Eroare la procesarea datelor.' });
    }
}

module.exports = router;
