const express = require('express');
const SolicitariController = require('../controllers/solicitariController');

const router = express.Router();

router.post('/', SolicitariController.uploadMiddleware,SolicitariController.create);
router.get('/', SolicitariController.findAll);
router.get('/:id', SolicitariController.findById);
router.put('/:id', SolicitariController.update);
router.delete('/:id', SolicitariController.delete);
router.get('/:studentId/requests/:requestId/download', SolicitariController.downloadDocument);

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
