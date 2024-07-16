const { tipUtilizator } = require('../models');

const tipUtilizatorController = {
    // Crearea unui tip de utilizator nou
    createTip: async (req, res) => {
        try {
            const { denumire } = req.body;
            const tip = await tipUtilizator.create(req.body);
            res.status(201).send(tip);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    // Afișarea tuturor tipurilor de utilizatori
    getAllTips: async (req, res) => {
        try {
            const tips = await tipUtilizator.findAll();
            res.status(200).send(tips);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Afișarea unui tip de utilizator după ID
    getTipById: async (req, res) => {
        try {
            const tip = await tipUtilizator.findByPk(req.params.id);
            if (tip) {
                res.status(200).send(tip);
            } else {
                res.status(404).send({ message: 'Tipul de utilizator nu a fost găsit.' });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Actualizarea unui tip de utilizator
    updateTip: async (req, res) => {
        try {
            const result = await tipUtilizator.update(req.body, {
                where: { idUtilizator: req.params.id }
            });
            if (result[0] === 1) {
                res.status(200).send({ message: 'Tipul de utilizator a fost actualizat.' });
            } else {
                res.status(404).send({ message: 'Tipul de utilizator nu a fost găsit.' });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Ștergerea unui tip de utilizator
    deleteTip: async (req, res) => {
        try {
            const result = await tipUtilizator.destroy({
                where: { idUtilizator: req.params.id }
            });
            if (result === 1) {
                res.status(200).send({ message: 'Tipul de utilizator a fost șters.' });
            } else {
                res.status(404).send({ message: 'Tipul de utilizator nu a fost găsit.' });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = tipUtilizatorController;
