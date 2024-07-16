const express = require('express');
const router = express.Router();
const tipBursaController = require('../controllers/tipBursaController');

router.post('/', tipBursaController.createTipBursa);
router.get('/', tipBursaController.getAllTipuriBursa);
router.get('/:id', tipBursaController.getTipBursaById);//ish
router.put('/:id', tipBursaController.updateTipBursa);
router.delete('/:id', tipBursaController.deleteTipBursa);
router.post('/updateStateBudgetTotal', tipBursaController.updateBudgetAllocationState);
router.post('/updatePrivateBudgetTotal', tipBursaController.updateBudgetAllocationPrivate);
router.put('/update/:id', tipBursaController.updateScholarshipQuantities);
 
module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
