const express = require('express');
const router = express.Router();
const tipUtilizatorController = require('../controllers/tipUtilizatorController');

router.post('/', tipUtilizatorController.createTip); //DA
router.get('/', tipUtilizatorController.getAllTips); //DA
router.get('/:id', tipUtilizatorController.getTipById); //DA//ish
router.put('/:id', tipUtilizatorController.updateTip); // DA
router.delete('/:id', tipUtilizatorController.deleteTip); // DA

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
