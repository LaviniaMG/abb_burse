const express = require('express');
const router = express.Router();
const anunturiController = require('../controllers/anunturiController');

router.post('/create',anunturiController.uploadMiddleware, anunturiController.createAnunt);//DA
router.get('/', anunturiController.getAnunt);//DA
router.delete('/:id', anunturiController.deleteAnunt);//DA

module.exports = router;
//este ok asa