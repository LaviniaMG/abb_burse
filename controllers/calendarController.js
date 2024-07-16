const { calendar } = require('../models');

const calendarController = {
    createEvent: async (req, res) => {
        try {
            const { idUtilizator, Titlu, Descriere, dataEvenimentStart, dataEvenimentFinal, CuloareText, CuloareFundal, ToataZiuaBool } = req.body;
            const newEvent = await calendar.create({
                idUtilizator, Titlu, Descriere, dataEvenimentStart, dataEvenimentFinal, CuloareText, CuloareFundal, ToataZiuaBool
            });
            res.status(201).send(newEvent);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllEvents: async (req, res) => {
        try {
            const events = await calendar.findAll();
            res.status(200).send(events);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await calendar.findByPk(req.params.id);
            if (event) {
                res.status(200).send(event);
            } else {
                res.status(404).json({ message: 'Event not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateEvent: async (req, res) => {
        try {
            const { Titlu, Descriere, dataEvenimentStart, dataEvenimentFinal, CuloareText, CuloareFundal, ToataZiuaBool } = req.body;
            const result = await calendar.update(
                { Titlu, Descriere, dataEvenimentStart, dataEvenimentFinal, CuloareText, CuloareFundal, ToataZiuaBool },
                { where: { IdEveniment: req.params.id } }
            );
            if (result[0] === 1) {
                res.status(200).json({ message: 'Event updated successfully.' });
            } else {
                res.status(404).json({ message: 'Event not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const result = await calendar.destroy({ where: { IdEveniment: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Event deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Event not found.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = calendarController;
