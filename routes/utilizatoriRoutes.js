const express = require('express');
const router = express.Router();
const utilizatoriController = require('../controllers/utilizatoriController');

router.post('/create', utilizatoriController.createUtilizator);//DA
router.get('/', utilizatoriController.getAllutilizatori);//DA
router.get('/:id', utilizatoriController.getutilizatorById);//DA
router.put('/:id', utilizatoriController.updateUtilizator);//DA
router.delete('/:id', utilizatoriController.deleteutilizator);//DA
router.post('/utilizatori/login', utilizatoriController.loginUtilizator);

module.exports = router;
