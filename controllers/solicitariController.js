const { solicitari, tipBursa,student, utilizator } = require('../models');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
// Middleware pentru pre-procesarea cererii și setarea directorului în funcție de tipul bursei
async function setUploadPath(req, res, next) {
    const { idBursa } = req.body;
    if (!idBursa) {
        return res.status(400).send({ message: 'ID-ul bursei lipsește din cerere.' });
    }
    try {
        const bursa = await tipBursa.findByPk(idBursa);

        if (!bursa) {
            return res.status(404).send({ message: 'Bursa este '+bursa+'si'+idBursa });
        }
        req.bursaPath = `./${bursa.denumire}/`; // Numele directorului bazat pe denumirea bursei
        next();
    } catch (error) {
        res.status(500).send({ message: 'Eroare la căutarea tipului de bursă.' });
    }
}
// Configurarea Multer pentru a salva fișierele într-un folder specific
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, req.bursaPath || './uploads-concurs/'); 
//     },
//     filename: function(req, file, cb) {
//         let customFileName = crypto.randomBytes(5).toString('hex');
     
//         let fileExtension = path.extname(file.originalname).toLowerCase();
    
//         cb(null, customFileName + '-' + Date.now() + fileExtension);
//     }
// });

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = req.bursaPath || './uploads-concurs/';
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            let customFileName = crypto.randomBytes(5).toString('hex');
            let fileExtension = path.extname(file.originalname).toLowerCase();
            cb(null, `${customFileName}-${Date.now()}${fileExtension}`);
        }
    })
});

const SolicitariController = {
   // Middleware pentru încărcarea fișierelor
   uploadMiddleware: (req, res, next) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            return res.status(500).send({ message: 'Upload error', error: err.message });
        }
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded!' });
        }
        next();
    });
    
},
   setUploadPath: async (req, res, next) => {
    console.log('idBursa received:', req.body.idBursa); // Verifică ce primești în idBursa
    if (!req.body.idBursa) {
        return res.status(400).send({ message: 'ID-ul bursei lipsește din cerere.' });
    }
    try {
        const bursa = await tipBursa.findByPk(req.body.idBursa);
        console.log('Bursa found:', bursa); // Afișează ce returnează baza de date
        if (!bursa) {
            return res.status(404).send({ message: 'Bursa nu a fost găsită.' });
        }
        req.bursaPath = `./${bursa.denumire}/`;
        next();
    } catch (error) {
        console.error('Error in setUploadPath:', error);
        res.status(500).send({ message: 'Eroare la căutarea bursei.', error: error.message });
    }
},

downloadDocument: async (req, res) => {
    try {
      const { studentId, requestId } = req.params;
  
      // Găsirea solicitării specifice pentru un anumit student
      const request = await solicitari.findOne({
        where: { 
          idSolicitare: requestId // Schimbare aici la id-ul solicitarii, nu la idUtilizator
        },
        include: [
          {
            model: utilizator,
            as:'utilizator',
            include: [
              {
                model: student,
                as:'student',
                where: { idUtilizator: studentId } // Schimbare aici la id-ul studentului
              }
            ]
          }
        ]
      });
 
      if (request && request.DocumentURL) {
        const DocumentURL = path.resolve(request.DocumentURL);
        // Verificăm dacă fișierul există
        if (fs.existsSync(DocumentURL)) {
          res.download(DocumentURL);
        } else {
          res.status(404).json({ message: "Document not found." });
        }
      } else {
        res.status(404).json({ message: "Request or student not found." });
      }
    } catch (error) {
      console.error("Error downloading document: ", error);
      res.status(500).json({ message: "Error downloading document", error });
    }
  },

   create: (req, res) => {
       // Crearea unei noi solicitări după ce fișierul a fost încărcat și bursa identificată
       if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded!' });
    }
       let { idUtilizator, idBursa,denumireBursa } = req.body;
       const DocumentURL = req.file.path;
     
       solicitari.create({ idUtilizator, DocumentURL, idBursa,denumireBursa })
           .then(solicitare => res.status(201).send(solicitare))
           .catch(error => res.status(400).send(error));
   },

   // Afișarea tuturor solicitărilor
   findAll(req, res) {
       solicitari.findAll()
           .then(solicitaris => res.status(200).send(solicitaris))
           .catch(error => res.status(400).send(error));
   },

   // Găsirea unei solicitări după ID
   findById(req, res) {
       const id = req.params.id;
       solicitari.findByPk(id)
           .then(solicitare => {
               if (!solicitare) {
                   return res.status(404).send({ message: 'Solicitare nu a fost găsită.' });
               }
               res.status(200).send(solicitare);
           })
           .catch(error => res.status(400).send(error));
   },

   update: async (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    try {
      const [updated] = await solicitari.update(updates, {
        where: { idSolicitare: id }
      });

      if (updated) {
        const updatedSolicitare = await solicitari.findOne({ where: { idSolicitare: id } });
        res.status(200).json({ solicitare: updatedSolicitare, message: "Solicitarea a fost actualizată cu succes." });
      } else {
        res.status(404).json({ message: `Nu se poate actualiza solicitarea cu id=${id}. Poate solicitarea nu a fost găsită sau req.body este gol!` });
      }
    } catch (error) {
      res.status(500).json({ message: "A apărut o eroare la actualizarea solicitării.", error: error.message });
    }
  }, 

   // Ștergerea unei solicitări
   delete(req, res) {
       const id = req.params.id;

       solicitari.destroy({ where: { idSolicitare: id } })
           .then(num => {
               if (num == 1) {
                   res.send({ message: "Solicitarea a fost ștearsă cu succes!" });
               } else {
                   res.send({ message: `Nu se poate șterge solicitarea cu id=${id}. Poate solicitarea nu a fost găsită!` });
               }
           })
           .catch(error => res.status(400).send(error));
   }
};

module.exports = SolicitariController;
