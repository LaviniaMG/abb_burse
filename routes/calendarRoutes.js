const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.post('/', calendarController.createEvent);//DA
router.get('/', calendarController.getAllEvents);//DA
router.get('/:id', calendarController.getEventById);//DA
router.put('/:id', calendarController.updateEvent);//DA
router.delete('/:id', calendarController.deleteEvent);//DA

module.exports = router;
//este okay asa