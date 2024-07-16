const { utilizator } = require("../models");
const bcrypt = require('bcrypt');


const utilizatoriController = {
  createUtilizator: async (req, res) => {
    try {
      const utilizatorNew = await utilizator.create(req.body);
      res.status(201).send(utilizatorNew);
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error,
      });
    }
  },

  getAllutilizatori: async (req, res) => {
    try {
      const utilizatori = await utilizator.findAll();
      res.status(200).send(utilizatori);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Afișarea unui utilizator după ID
  getutilizatorById: async (req, res) => {
    try {
      const utilizatorId = await utilizator.findByPk(req.params.id);
      if (utilizator) {
        res.status(200).send(utilizatorId);
      } else {
        res.status(404).send({ message: "utilizatorul nu a fost găsit." });
      }
    } catch (error) {
      res.status(500).send({ message: "EROARE :(" });
    }
  },
   
  loginUtilizator: async (req, res) => {
    try {
      const { Email, Parola } = req.body;
      const utilizatorFound = await utilizator.findOne({ where: { Email } });
      if (utilizatorFound && utilizatorFound.verificaParola(Parola)) {
        res.status(200).send({ message: "Login successful", utilizator: utilizatorFound });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  },

  // Actualizarea unui utilizator

updateUtilizator: async (req, res) => {
    const { CNP, Nume, Prenume, InitialaTata, Telefon, URLPoza, Email, Parola } = req.body;
    const id = req.params.id;

    try {
      const utilizatorFound = await utilizator.findByPk(id);
      if (!utilizatorFound) {
        return res.status(404).send({ message: "Utilizator not found." });
      }

      if (Parola) {
        // Actualizăm parola cu o versiune hashuită
        req.body.Parola = bcrypt.hashSync(Parola, 10);
      }

      await utilizator.update(req.body, { where: { idUtilizator: id } });
      res.status(200).send({ message: "Utilizator updated successfully." });
    } catch (error) {
      console.error("Error updating utilizator: ", error);
      res.status(500).json({ message: "Error updating utilizator", error });
    }
  },

  // Ștergerea unui utilizator
  deleteutilizator: async (req, res) => {
    try {
      const result = await utilizator.destroy({
        where: { idutilizator: req.params.id },
      });
      if (result === 1) {
        res.status(200).send({ message: "utilizatorul a fost șters." });
      } else {
        res.status(404).send({ message: "utilizatorul nu a fost găsit." });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = utilizatoriController;
