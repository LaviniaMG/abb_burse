const express = require('express')
const anunturiRoutes = require('./routes/anunturiRoutes')
//const anunturiRoutes = require('./routes/uploadRoutes');
const app = express();
const cors = require('cors');
app.get('/uploads-anunturi/:filename', (req, res) => {
    const filename = req.params.filename;
    const fileDirectory = path.join(__dirname, 'uploads-anunturi', filename);

    res.download(fileDirectory); // Metoda `download` din Express setează automat header-ul `Content-Disposition` la `attachment`.
});

const path = require('path');
const utilizatoriRoutes = require('./routes/utilizatoriRoutes');
const tipUtilizatorRoutes = require('./routes/tipUtilizatorRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const conturiRoutes = require('./routes/conturiRoutes');
const semestruRoutes = require('./routes/semestruRoutes');
const statusRoutes = require('./routes/statusRoutes');
const tipBursaRoutes = require('./routes/tipBursaRoutes');
const facturiRoutes = require('./routes/facturiRoutes');
const facultateRoutes = require('./routes/facultateRoutes');
const solicitariRoutes = require('./routes/solicitariRoutes');
const loadStudents1Routes = require('./routes/loadStudents1Routes')
const loadStudents2Routes = require('./routes/loadStudents2Routes')
const loadStudents3Routes = require('./routes/loadStudents3Routes')
const loadStudents5Routes = require('./routes/loadStudents5Routes')
const studentiRoutes = require('./routes/studentiRoutes');
const pdfRoutes = require('./routes/pdfCercetareRoutes');
const pdfsportivaRoutes = require('./routes/pdfSportivaRoutes')
const pdfremarcabileRoutes = require('./routes/pdfEPDAOCRoutes')
const pdfperformantaRoutes = require('./routes/pdfEDACSRoutes')
const pdfrezDeosebiteRoutes = require('./routes/pdfRDACORoutes')
const pdfmihailRoutes = require('./routes/pdfMMRoutes')
const studentiEmailsRoutes = require('./routes/studentiEmailsRoutes');
const emails = require('./routes/emailRoutes')

app.use(express.json());
app.use(cors())

app.use('/api/anunturi', anunturiRoutes);
app.use('/api/utilizatori', utilizatoriRoutes);
app.use('/api/tipuriUtilizatori', tipUtilizatorRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/conturi', conturiRoutes);
app.use('/api/semestru', semestruRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/tipBursa', tipBursaRoutes);
app.use('/api/facturi', facturiRoutes);
app.use('/api/facultate',facultateRoutes);
app.use('/api/solicitari', solicitariRoutes);
app.use('/uploads-students/1',loadStudents1Routes);
app.use('/uploads-students/2',loadStudents2Routes);
app.use('/uploads-students/3',loadStudents3Routes);
app.use('/uploads-students/5',loadStudents5Routes);
app.use('/api/studenti',studentiRoutes);
app.use('/api/studenti-email', studentiEmailsRoutes);//NOT USED
app.use('/api/concurs/cercetrareStiintifica',pdfRoutes)
app.use('/api/concurs/sportiva',pdfsportivaRoutes)
app.use('/api/concurs/remarcabile',pdfremarcabileRoutes)
app.use('/api/concurs/performanta',pdfperformantaRoutes)
app.use('/api/concurs/rezultateDeosebite',pdfrezDeosebiteRoutes)
app.use('/api/concurs/mihailManoilescu',pdfmihailRoutes)
app.use('/api',emails)
app.use('/uploads-anunturi', express.static('uploads-anunturi'));
app.use(cors({
    origin: 'http://localhost:8081' // Permit accesul doar pentru frontend-ul tău care rulează pe portul 8081
  }));
app.use('/data', express.static('./data'))
app.listen(8080, () => {
    console.log('Serverul a pornit pe portul 8080...');
})

