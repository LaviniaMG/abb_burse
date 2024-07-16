const express = require('express');
const router = express.Router();


const FacultateController = require('../controllers/facultateController');

router.post('/', FacultateController.createFacultate);
router.get('/', FacultateController.getAllFacultati);
router.get('/:id', FacultateController.getFacultateById);
router.put('/:id', FacultateController.updateFacultate);
router.delete('/:id', FacultateController.deleteFacultate);

module.exports = router;