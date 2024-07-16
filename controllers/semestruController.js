const { semestru } = require('../models');

const semestruController = {
    createSemestru: async (req, res) => {
        try {
            const { dataStart, dataFinal } = req.body;
            const newSemestru = await semestru.create({ dataStart, dataFinal });
            res.status(201).send(newSemestru);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllSemestre: async (req, res) => {
        try {
            const semestre = await semestru.findAll();
            res.status(200).send(semestre);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSemestruById: async (req, res) => {
        try {
            const sem = await semestru.findByPk(req.params.id);
            if (sem) {
                res.status(200).send(sem);
            } else {
                res.status(404).json({ message: 'Semestru not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateSemestru: async (req, res) => {
        try {
            const { dataStart, dataFinal } = req.body;
            const result = await semestru.update(
                { dataStart, dataFinal },
                { where: { idSemestru: req.params.id } }
            );
            if (result[0] === 1) {
                res.status(200).json({ message: 'Semestru updated successfully.' });
            } else {
                res.status(404).json({ message: 'Semestru not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteSemestru: async (req, res) => {
        try {
            const result = await semestru.destroy({ where: { idSemestru: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Semestru deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Semestru not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = semestruController;
