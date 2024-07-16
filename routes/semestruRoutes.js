const express = require('express');
const router = express.Router();
const semestruController = require('../controllers/semestruController');

router.post('/', semestruController.createSemestru);
router.get('/', semestruController.getAllSemestre);
router.get('/:id', semestruController.getSemestruById);
router.put('/:id', semestruController.updateSemestru);
router.delete('/:id', semestruController.deleteSemestru);

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
