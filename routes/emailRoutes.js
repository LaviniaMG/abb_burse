const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configurați Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // sau un alt serviciu de email
  auth: {
    user: 'lavinia09052002@gmail.com',
    pass: 'jmaa oogq rleh nhmc'
  }
});

// Endpoint pentru trimiterea emailurilor
router.post('/send-emails', async (req, res) => {
  const { subject, body, recipients } = req.body;

  const mailOptions = {
    from: 'lavinia09052002@gmail.com',
    to: recipients, // Poate fi un string cu emailuri separate prin virgulă
    subject: subject,
    text: body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Emailuri trimise cu succes!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send({ message: 'Eroare la trimiterea emailurilor.', error });
  }
});

module.exports = router;
