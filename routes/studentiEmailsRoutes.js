const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentiController');

router.get('/', studentController.getAllStudentEmails);

module.exports = router;
