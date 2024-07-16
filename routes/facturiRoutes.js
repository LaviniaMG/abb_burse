const express = require('express');
const FacturiController = require('../controllers/facturiController');

const router = express.Router();

//DA
router.post('/', FacturiController.create);
router.get('/', FacturiController.findAll);
router.get('/:id', FacturiController.findById);
router.put('/:id', FacturiController.update);
router.delete('/:id', FacturiController.delete);

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
