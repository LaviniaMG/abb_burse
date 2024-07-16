const { facultate } = require('../models');

const FacultateController = {
    createFacultate: async (req, res) => {
        try {
            const { denumire, specializare } = req.body;
            const newFacultate = await facultate.create({ denumire, specializare });
            res.status(201).send(newFacultate);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllFacultati: async (req, res) => {
        try {
            const facultati = await facultate.findAll();
            res.status(200).send(facultati);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getFacultateById: async (req, res) => {
        try {
            const facultati = await facultate.findByPk(req.params.id);
            if (facultati) {
                res.status(200).send(facultati);
            } else {
                res.status(404).json({ message: 'Facultate not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateFacultate: async (req, res) => {
        try {
            const { facultati, specializare } = req.body;
            const result = await facultate.update(
                { facultati, specializare },
                { where: { id: req.params.id } }
            );
            if (result[0] === 1) {
                res.status(200).json({ message: 'Facultate updated successfully.' });
            } else {
                res.status(404).json({ message: 'Facultate not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteFacultate: async (req, res) => {
        try {
            const result = await facultate.destroy({ where: { id: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Facultate deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Facultate not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = FacultateController;
