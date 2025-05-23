const { typeExamen, examen } = require('../models/examen');

const prescrireExamens = async (req, res) => {
    try {
        const { matricule, consultationId, examens, priorite } = req.body;
        
        if (!examens || examens.length === 0) {
            return res.status(400).json({ message: 'Aucun examen sélectionné' });
        }
        
        const examensPrescrits = [];
        
        for (const examenId of examens) {
            const nouveauExamen = await examen.create({
                matricule,
                consultationId,
                typeExamenId: examenId,
                priorite: priorite || 'Normal',
                statut: 'Prescrit'
            });
            examensPrescrits.push(nouveauExamen);
        }
        
        res.status(201).json({
            message: 'Examens prescrits avec succès',
            data: examensPrescrits
        });
    } catch (error) {
        console.error('Erreur lors de la prescription des examens:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les examens d'une consultation
const getExamensConsultation = async (req, res) => {
    try {
        const { consultationId } = req.params;
        
        const examens = await examen.findAll({
            where: { consultationId },
            include: [{
                model: typeExamen,
                attributes: ['nom', 'categorie', 'prix']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter ces exports au module.exports existant
module.exports = {
    // ... exports existants
    updateConsultationResultById,
    getConsultations,
    changeStateConsultation,
    prescrireExamens,
    getExamensConsultation
};