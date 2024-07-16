const express = require('express');
const router = express.Router();
const conturiController = require('../controllers/conturiController');

//DA
router.post('/', conturiController.createCont);
router.get('/', conturiController.getAllConturi);
router.get('/:id', conturiController.getContById);
router.put('/:id', conturiController.updateCont);
router.delete('/:id', conturiController.deleteCont);

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
