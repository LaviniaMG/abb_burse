const { conturi } = require('../models');

const conturiController = {
    createCont: async (req, res) => {
        try {
            const {  Titular, numeBanca, dataExpirare, Moneda, IBAN, CIF, SWIFT } = req.body;
          let   idUtilizator=16;
            const newCont = await conturi.create({
                idUtilizator, Titular, numeBanca, dataExpirare, Moneda, IBAN, CIF, SWIFT
            });
            res.status(201).send(newCont);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllConturi: async (req, res) => {
        try {
            const allConturi = await conturi.findAll();
            res.status(200).send(allConturi);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getContById: async (req, res) => {
        try {
            const cont = await conturi.findByPk(req.params.id);
            if (cont) {
                res.status(200).send(cont);
            } else {
                res.status(404).json({ message: 'Cont not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCont: async (req, res) => {
        try {
            const { Titular, numeBanca, dataExpirare, Moneda, IBAN, CIF, SWIFT } = req.body;
            const result = await conturi.update(
                { Titular, numeBanca, dataExpirare, Moneda, IBAN, CIF, SWIFT },
                { where: { idCont: req.params.id } }
            );
            if (result[0] === 1) {
                res.status(200).json({ message: 'Cont updated successfully.' });
            } else {
                res.status(404).json({ message: 'Cont not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCont: async (req, res) => {
        try {
            const result = await conturi.destroy({ where: { idCont: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Cont deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Cont not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = conturiController;
