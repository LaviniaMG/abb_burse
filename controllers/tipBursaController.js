const { tipBursa } = require('../models');

const tipBursaController = {
    createTipBursa: async (req, res) => {
        try {
            const { denumire,dataStart, dataFinal } = req.body;
            const newTipBursa = await tipBursa.create({ denumire, dataStart, dataFinal });
            res.status(201).send(newTipBursa);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAllTipuriBursa: async (req, res) => {
        try {
            const tipuriBursa = await tipBursa.findAll();
            res.status(200).send(tipuriBursa);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTipBursaById: async (req, res) => {
        try {
            const tipBursaItem = await tipBursa.findByPk(req.params.id);
            if (tipBursaItem) {
                res.status(200).send(tipBursaItem);
            } else {
                res.status(404).json({ message: 'Tipul de bursă nu a fost găsit.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateBudgetAllocationState: async (req, res) => {
        try {
            const { bugetTotal } = req.body;
    
            // Verifică dacă bugetTotal este un număr
            if (typeof bugetTotal !== 'number' || isNaN(bugetTotal)) {
                return res.status(400).json({ message: "Invalid budget total provided." });
            }
    
            // Verifică dacă bugetTotal este un număr pozitiv
            if (bugetTotal <= 0) {
                return res.status(400).json({ message: "Budget total must be a positive number." });
            }
    
            // Burse din bugetul de stat
            const updates = [
                { idBursa: 1, percent: 0.20 },
                { idBursa: 2, percent: 0.05 },
                { idBursa: 3, percent: 0.20 },
                { idBursa: 4, percent: 0.10 },
                { idBursa: 5, percent: 0.30 },
                { idBursa: 6, percent: 0.05 },
                { idBursa: 7, percent: 0.10 }
            ];
    
            for (let update of updates) {
                const calculatedBudget = bugetTotal * update.percent;
                await tipBursa.update({
                    bugetBursa: calculatedBudget,
                    bugetTotal: bugetTotal  // actualizarea bugetului total pentru fiecare tip de bursă
                }, {
                    where: { idBursa: update.idBursa }
                });
            }
    
            res.status(200).json({ message: 'Bugetul burselor de stat a fost actualizat cu succes.' });
        } catch (error) {
            console.error("Failed to update scholarship budgets", error);
            res.status(500).json({ message: error.message });
        }
    },
    updateBudgetAllocationPrivate: async (req, res) => {
        try {
            const { bugetTotal } = req.body;
    
            // Verifică dacă bugetTotal este un număr
            if (typeof bugetTotal !== 'number' || isNaN(bugetTotal)) {
                return res.status(400).json({ message: "Invalid budget total provided." });
            }
    
            // Verifică dacă bugetTotal este un număr pozitiv
            if (bugetTotal <= 0) {
                return res.status(400).json({ message: "Budget total must be a positive number." });
            }
    
            // Burse din bugetul de stat
            const updates = [
                { idBursa: 8, percent: 0.30 },
                { idBursa: 9, percent: 0.20 },
                { idBursa: 10, percent: 0.40 },
                { idBursa: 11, percent: 0.10 }
            ];
    
            for (let update of updates) {
                const calculatedBudget = bugetTotal * update.percent;
                await tipBursa.update({
                    bugetBursa: calculatedBudget,
                    bugetTotal: bugetTotal  // actualizarea bugetului total pentru fiecare tip de bursă
                }, {
                    where: { idBursa: update.idBursa }
                });
            }
    
            res.status(200).json({ message: 'Bugetul burselor private a fost actualizat cu succes.' });
        } catch (error) {
            console.error("Failed to update scholarship budgets", error);
            res.status(500).json({ message: error.message });
        }
    },
    updateScholarshipQuantities: async (req, res) => {
        console.log("Request body:", req.body); // Log the request body for debugging
        const idBursa = parseInt(req.params.id);
        const {  cuantum } = req.body;
    
        if (!cuantum || isNaN(cuantum)) {
            return res.status(400).json({ message: 'Cuantumul trebuie să fie specificat și să fie un număr.' });
        }
        if (!idBursa || isNaN(idBursa)) {
            return res.status(400).json({ message: 'ID-ul bursei trebuie să fie specificat și să fie un număr.' });
        }
    
        try {
            const bursa = await tipBursa.findByPk(idBursa);
            if (!bursa) {
                console.error("Bursa not found for ID:", idBursa);
                return res.status(404).json({ message: 'Tipul de bursă nu a fost găsit.' });
            }
    
            await bursa.update({
                cuantum: parseFloat(cuantum),
                nrBursieri: Math.floor(bursa.bugetBursa / cuantum)
            });
    
            res.status(200).json({
                message: 'Numărul de bursieri și cuantumul au fost actualizate cu succes.',
                data: {
                    idBursa,
                    cuantum,
                    nrBursieri: bursa.nrBursieri
                }
            });
        } catch (error) {
            console.error("Failed to update scholarship quantities", error);
            res.status(500).json({ message: error.message });
        }
    },
    
    
     updateTipBursa: async (req, res) => {
        try {
            const {  cuantum, dataStart, dataFinal } = req.body;
    
            // Preiați întâi tipul de bursă existent pentru a putea compara dacă cuantumul se schimbă
            const bursa = await tipBursa.findByPk(req.params.id);
            if (!bursa) {
                return res.status(404).json({ message: 'Tipul de bursă nu a fost găsit.' });
            }
    
            const result = await tipBursa.update(
                {  cuantum, dataStart, dataFinal },
                { where: { idBursa: req.params.id } }
            );
    
            if (result[0] === 1) {
                // Verifică dacă cuantumul s-a schimbat și dacă bugetul este definit
                if (cuantum) {
                    const nrBursieri = Math.floor(bursa.bugetBursa / cuantum);
                    // Actualizează numărul de bursieri
                    await tipBursa.update({ nrBursieri }, { where: { idBursa: req.params.id } });
                    res.status(200).json({ message: 'Tipul de bursă și numărul de bursieri au fost actualizați cu succes.' });
                } else {
                    res.status(200).json({ message: 'Tipul de bursă a fost actualizat cu succes.' });
                }
            } else {
                res.status(404).json({ message: 'Tipul de bursă nu a fost găsit.' });
            }
        } catch (error) {
            console.error('Error updating scholarship type:', error);
            res.status(500).json({ message: error.message });
        }
    },
    
    deleteTipBursa: async (req, res) => {
        try {
            const result = await tipBursa.destroy({ where: { idBursa: req.params.id } });
            if (result === 1) {
                res.status(200).json({ message: 'Tipul de bursă a fost șters cu succes.' });
            } else {
                res.status(404).json({ message: 'Tipul de bursă nu a fost găsit.' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = tipBursaController;
