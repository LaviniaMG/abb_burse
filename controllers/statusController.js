const { status } = require('../models');

const statusController = {
    createStatus: async (req, res) => {
        try {
            const { denumire } = req.body;
            const newStatus = await status.create({ denumire });
            res.status(201).send(newStatus);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllStatusuri: async (req, res) => {
        try {
            const statusuri = await status.findAll();
            res.status(200).send(statusuri);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getStatusById: async (req, res) => {
        try {
            const stat = await status.findByPk(req.params.id);
            if (stat) {
                res.status(200).send(stat);
            } else {
                res.status(404).json({ message: 'Status not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { denumire } = req.body;
            const result = await status.update(
                { denumire },
                { where: { idStatus: req.params.id } }
            );
            if (result[0] === 1) {
                res.status(200).json({ message: 'Status updated successfully.' });
            } else {
                res.status(404).json({ message: 'Status not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteStatus: async (req, res) => {
        try {
            const result = await status.destroy({ where: { idStatus: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Status deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Status not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = statusController;
