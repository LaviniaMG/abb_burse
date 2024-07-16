const { anunturi } = require('../models');  // Asumând că modelele sunt exportate dintr-un index centralizat
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); // Pentru generarea unui nume de fișier unic

// Configurarea Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads-anunturi/'); // Folderul destinat pentru încărcarea fișierelor
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);   }
});

const upload = multer({ storage: storage });

const anunturiController={
    uploadMiddleware: upload.single('file'),
 
    // Crearea unui nou anunț
    createAnunt: (req, res) => {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded" });
        }

        const { IdPublicant, text, dataAnuntStart, dataAnuntFinal, subiect,idUtilizator } = req.body;
        const documentURL = req.file.path; // URL-ul documentului încărcat

        anunturi.create({ IdPublicant, text, documentURL, dataAnuntStart, dataAnuntFinal, subiect, idUtilizator })
            .then(anunt => res.status(201).send(anunt))
            .catch(error => res.status(400).send(error));
    },

    // Obținerea anunțurilor active
    getAnunt: async (req, res) => {
        const currentDate = new Date();
        try {
            const anunturiRez = await anunturi.findAll({
                where: {
                    dataAnuntFinal: { [Op.gt]: currentDate } // Selectează anunțurile cu data finală mai mare decât data curentă
                }
            });
            res.status(200).send(anunturiRez);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Ștergerea unui anunț
    deleteAnunt: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await anunturi.destroy({
                where: { idAnunt: id }
            });
            if (result === 1) {
                res.status(200).send({ message: "Anunțul a fost șters." });
            } else {
                res.status(404).send({ message: "Anunțul nu a fost găsit." });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = anunturiController;