const { student ,facultate, utilizator, solicitari, conturi} = require("../models"); // Include și modelul utilizator pentru a putea face join când este necesar
const { sequelize } = require('../models'); 
const studentController = {
  // Crearea unui student nou
  createStudent: async (req, res) => {
    const {
      CNP, Nume, Prenume, InitialaTata, Telefon, URLPoza, Email, Parola, idTipUtilizator,
      idFacultate, anFacultate, media, restanta, idBursa, file, idStatus
    } = req.body;
  
    const transaction = await sequelize.transaction();
  
    try {
      const newUser = await utilizator.create({
        CNP, Nume, Prenume, InitialaTata, Telefon, URLPoza, Email, Parola, idTipUtilizator
      }, { transaction });
  
      const newStudent = await student.create({
        idFacultate, anFacultate, media, restanta, idUtilizator: newUser.idUtilizator
      }, { transaction });
  
      // Check if a new bursary application should be created
      if (idBursa && file) {
        const documentURL = file.path; // Assuming the file is already saved and path is available
        await solicitari.create({
          idUtilizator: newUser.idUtilizator,
          DocumentURL: documentURL,
          idStatus,
          idBursa
        }, { transaction });
      }
  
      await transaction.commit();
      res.status(201).json({ newUser, newStudent });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(400).json({ message: "Failed to create student and user", error });
    }
  },
  
getAllStudentEmails: 
async (req, res) => {
  try {
    const allStudents = await student.findAll({
      include: [utilizator], // Include detalii despre utilizator dacă este necesar
      attributes: ['Email']
    });
    res.status(200).json(allStudents.map(user => user.Email));
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve students", error });
  }
},

getAllStudents: async (req, res) => {
  try {
      const allStudents = await student.findAll({
          include: [
              {
                  model: facultate,
                  attributes: ['facultate','specializare']
              },
              {
                  model: utilizator,
                    include: [
                      {
                        model: solicitari,
                        as: 'solicitari', 
                        attributes: ['idSolicitare','denumireBursa','idStatus','idBursa']
                      },
                      {
                        model: conturi,
                        as: 'conturi', 
                        attributes: ['IBAN']
                      }
                    ]
                  } 
          ]
      });
      res.status(200).json(allStudents);
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve students", error });
  }
},


// Afișarea unui student după ID
getStudentById: async (req, res) => {
  try {
    const studentData = await student.findByPk(req.params.id, {
      include: [
        {
          model: utilizator
        },
        {
          model: facultate
        }
      ]
    });
    if (studentData) {
      res.status(200).json(studentData);
    } else {
      res.status(404).json({ message: "Student not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve student", error });
  }
},

  // Actualizarea unui student
  updateStudent: async (req, res) => {
    const {
      CNP, Nume, Prenume, InitialaTata, Telefon, URLPoza, Email, Parola, idTipUtilizator,
      idFacultate, anFacultate, media, restanta, idStatus
    } = req.body;
  
    const transaction = await sequelize.transaction();
  
    try {
      const existingStudent = await student.findByPk(req.params.id);
      if (!existingStudent) {
        res.status(404).json({ message: "Student not found." });
        return;
      }
  
      // Update associated user
      await utilizator.update({
        CNP, Nume, Prenume, InitialaTata, Telefon, URLPoza, Email, Parola, idTipUtilizator
      }, {
        where: { idUtilizator: existingStudent.idUtilizator },
        transaction
      });
  
      // Update student
      await student.update({
        idFacultate, anFacultate, media, restanta
      }, {
        where: { id: req.params.id },
        transaction
      });
      await solicitari.update({
         idStatus }, 
         { 
          where: { idUtilizator: existingStudent.idUtilizator },
           transaction 
          });
      await transaction.commit();
      const newStudentData = await student.findByPk(req.params.id, { include: [utilizator] });
      res.status(200).json({ message: "Student and user updated successfully", newStudentData });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating student: ", error);
      res.status(500).json({ message: "Error updating student", error });
    }
  },
  

  // Ștergerea unui student
  deleteStudent: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // Găsirea studentului și utilizatorului asociat
      const studentRecord = await student.findByPk(req.params.id);
      if (!studentRecord) {
        return res.status(404).json({ message: "Student not found." });
      }
      
      const utilizatorId = studentRecord.idUtilizator;

      // Ștergerea înregistrărilor din solicitări
      await solicitari.destroy({
        where: { idUtilizator: utilizatorId },
        transaction
      });

 
  

      await transaction.commit();
      res.status(200).json({ message: "Student and associated data deleted successfully." });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Error deleting student and associated data", error });
    }
  },
};

module.exports = studentController;
