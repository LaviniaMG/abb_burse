const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

router.post('/', statusController.createStatus);
router.get('/', statusController.getAllStatusuri);
router.get('/:id', statusController.getStatusById);//ish
router.put('/:id', statusController.updateStatus);
router.delete('/:id', statusController.deleteStatus);

module.exports = router;
//este okay asa-poate sa mai fac o pagina cu toata tabela de conturi pentru admin
