const { typeExamen, examen } = require('../models/examen');
const { consultation } = require('../models/consultation');
const { patient, personne } = require('../models/personne');

// Fonction pour mettre à jour les résultats de consultation
const updateConsultationResultById = async (req, res) => {
    try {
        const { matricule, diagnostique, prescription } = req.body;

        if (!matricule) {
            return res.status(400).json({ message: 'Matricule requis' });
        }

        // Trouver la consultation la plus récente pour ce patient
        const latestConsultation = await consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']],
        });

        if (!latestConsultation) {
            return res.status(404).json({ message: 'Aucune consultation trouvée pour ce patient' });
        }

        // Mettre à jour la consultation
        await latestConsultation.update({
            diagnostique: diagnostique,
            prescription: prescription,
        });

        res.status(200).json({
            message: 'Consultation mise à jour avec succès',
            consultation: latestConsultation
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la consultation :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la consultation' });
    }
};

// Fonction pour récupérer toutes les consultations
const getConsultations = async (req, res) => {
    try {
        const consultations = await consultation.consultation.findAll({
            include: [
                {
                    model: patient,
                    include: [{
                        model: personne,
                        attributes: ['firstName', 'lastName', 'birthDate', 'sex']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(consultations);
    } catch (error) {
        console.error('Erreur lors de la récupération des consultations :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Fonction pour changer le statut d'une consultation
const changeStateConsultation = async (req, res) => {
    try {
        const { matricule, statut } = req.body;

        if (!matricule || !statut) {
            return res.status(400).json({ message: 'Matricule et statut requis' });
        }

        const latestConsultation = await consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']],
        });

        if (!latestConsultation) {
            return res.status(404).json({ message: 'Consultation non trouvée' });
        }

        await latestConsultation.update({ statut: statut });

        res.status(200).json({
            message: 'Statut de consultation mis à jour',
            consultation: latestConsultation
        });

    } catch (error) {
        console.error('Erreur lors du changement de statut :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Fonction pour prescrire des examens
const prescrireExamens = async (req, res) => {
    try {
        const { matricule, consultationId, examens, priorite, commentaireMedecin, prescripteur } = req.body;
        
        if (!examens || examens.length === 0) {
            return res.status(400).json({ message: 'Aucun examen sélectionné' });
        }

        if (!matricule || !consultationId) {
            return res.status(400).json({ message: 'Matricule et ID de consultation requis' });
        }
        
        const examensPrescrits = [];
        
        for (const examenId of examens) {
            // Vérifier que le type d'examen existe
            const typeExamenExists = await typeExamen.findByPk(examenId);
            if (!typeExamenExists) {
                return res.status(400).json({ message: `Type d'examen ${examenId} non trouvé` });
            }

            const nouveauExamen = await examen.create({
                matricule,
                consultationId,
                typeExamenId: examenId,
                priorite: priorite || 'Normal',
                statut: 'Prescrit',
                prescripteur: prescripteur || 'Non spécifié',
                commentaireMedecin: commentaireMedecin || null,
                datePresciption: new Date()
            });
            examensPrescrits.push(nouveauExamen);
        }
        
        res.status(201).json({
            message: 'Examens prescrits avec succès',
            data: examensPrescrits
        });
    } catch (error) {
        console.error('Erreur lors de la prescription des examens:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
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
                as: 'typeExamen',
                attributes: ['nom', 'categorie', 'prix', 'description']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les types d'examens disponibles pour prescription
const getTypesExamensDisponibles = async (req, res) => {
    try {
        const types = await typeExamen.findAll({
            where: { disponible: true },
            order: [['categorie', 'ASC'], ['nom', 'ASC']]
        });
        res.status(200).json(types);
    } catch (error) {
        console.error('Erreur lors de la récupération des types d\'examens:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les résultats d'examens pour un patient
const getResultatsExamens = async (req, res) => {
    try {
        const { matricule } = req.params;
        
        const examensTermines = await examen.findAll({
            where: { 
                matricule: matricule,
                statut: 'Terminé'
            },
            include: [{
                model: typeExamen,
                as: 'typeExamen',
                attributes: ['nom', 'categorie']
            }],
            order: [['dateResultat', 'DESC']]
        });
        
        res.status(200).json(examensTermines);
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    updateConsultationResultById,
    getConsultations,
    changeStateConsultation,
    prescrireExamens,
    getExamensConsultation,
    getTypesExamensDisponibles,
    getResultatsExamens
};