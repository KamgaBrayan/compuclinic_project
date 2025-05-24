// BackEnd/controllers/controllerLaborantin.js
const { TypeExamen, PrescriptionExamen, ResultatExamen, ParametreExamen } = require('../models/laboratoire');
const { patient, personne } = require('../models/personne');
const { consultation } = require('../models/consultation');
const { Op } = require('sequelize');

// Gestion des types d'examens
const createTypeExamen = async (req, res) => {
    try {
        const { nom, code, description, prix, dureeEstimee, necessitePrevision, categorie } = req.body;
        
        const nouveauType = await TypeExamen.create({
            nom,
            code,
            description,
            prix,
            dureeEstimee,
            necessitePrevision,
            categorie
        });

        res.status(201).json({ 
            message: "Type d'examen créé avec succès", 
            typeExamen: nouveauType 
        });
    } catch (error) {
        console.error('Erreur lors de la création du type d\'examen:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création du type d\'examen', 
            error: error.message 
        });
    }
};

const getAllTypesExamens = async (req, res) => {
    try {
        const types = await TypeExamen.findAll({
            include: [ParametreExamen],
            order: [['categorie', 'ASC'], ['nom', 'ASC']]
        });

        res.status(200).json({ typesExamens: types });
    } catch (error) {
        console.error('Erreur lors de la récupération des types d\'examens:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des types d\'examens', 
            error: error.message 
        });
    }
};

const updateTypeExamen = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const typeExamen = await TypeExamen.findByPk(id);
        if (!typeExamen) {
            return res.status(404).json({ message: 'Type d\'examen non trouvé' });
        }

        await typeExamen.update(updates);
        res.status(200).json({ 
            message: 'Type d\'examen mis à jour avec succès', 
            typeExamen 
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour', 
            error: error.message 
        });
    }
};

// Gestion des paramètres d'examens
const addParametreToExamen = async (req, res) => {
    try {
        const { typeExamenId } = req.params;
        const { nom, unite, valeurMinNormale, valeurMaxNormale, typeValeur, obligatoire } = req.body;

        const parametre = await ParametreExamen.create({
            typeExamenId,
            nom,
            unite,
            valeurMinNormale,
            valeurMaxNormale,
            typeValeur,
            obligatoire
        });

        res.status(201).json({ 
            message: 'Paramètre ajouté avec succès', 
            parametre 
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du paramètre:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'ajout du paramètre', 
            error: error.message 
        });
    }
};

// Gestion des prescriptions d'examens
const getPrescriptionsEnAttente = async (req, res) => {
    try {
        const { statut = 'paye' } = req.query;
        
        const prescriptions = await PrescriptionExamen.findAll({
            where: { statut },
            include: [
                {
                    model: TypeExamen,
                    include: [ParametreExamen]
                },
                {
                    model: patient,
                    include: [personne]
                }
            ],
            order: [['urgence', 'DESC'], ['datePrescription', 'ASC']]
        });

        // Enrichir avec les informations du patient
        const prescriptionsEnrichies = await Promise.all(prescriptions.map(async (prescription) => {
            const infoPatient = await getPatientInfo(prescription.matriculePatient);
            return {
                ...prescription.toJSON(),
                patientInfo: infoPatient
            };
        }));

        res.status(200).json({ prescriptions: prescriptionsEnrichies });
    } catch (error) {
        console.error('Erreur lors de la récupération des prescriptions:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des prescriptions', 
            error: error.message 
        });
    }
};

const commencerExamen = async (req, res) => {
    try {
        const { id } = req.params;
        const { laborantinId } = req.body;

        const prescription = await PrescriptionExamen.findByPk(id);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription non trouvée' });
        }

        if (prescription.statut !== 'paye') {
            return res.status(400).json({ message: 'L\'examen doit être payé avant d\'être commencé' });
        }

        await prescription.update({ 
            statut: 'en_cours',
            dateRealisation: new Date()
        });

        res.status(200).json({ 
            message: 'Examen commencé avec succès', 
            prescription 
        });
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'examen:', error);
        res.status(500).json({ 
            message: 'Erreur lors du démarrage de l\'examen', 
            error: error.message 
        });
    }
};

const saisirResultats = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { 
            laborantinId, 
            resultats, 
            interpretation, 
            valeursAnormales, 
            commentaires 
        } = req.body;

        // Vérifier que la prescription existe et est en cours
        const prescription = await PrescriptionExamen.findByPk(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription non trouvée' });
        }

        if (prescription.statut !== 'en_cours') {
            return res.status(400).json({ message: 'L\'examen doit être en cours pour saisir les résultats' });
        }

        // Créer ou mettre à jour les résultats
        let resultatExamen = await ResultatExamen.findOne({ 
            where: { prescriptionExamenId: prescriptionId } 
        });

        if (resultatExamen) {
            await resultatExamen.update({
                resultats,
                interpretation,
                valeursAnormales,
                commentaires,
                laborantinId
            });
        } else {
            resultatExamen = await ResultatExamen.create({
                prescriptionExamenId: prescriptionId,
                laborantinId,
                resultats,
                interpretation,
                valeursAnormales,
                commentaires
            });
        }

        res.status(200).json({ 
            message: 'Résultats saisis avec succès', 
            resultat: resultatExamen 
        });
    } catch (error) {
        console.error('Erreur lors de la saisie des résultats:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la saisie des résultats', 
            error: error.message 
        });
    }
};

const validerResultats = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { laborantinId } = req.body;

        const resultat = await ResultatExamen.findOne({ 
            where: { prescriptionExamenId: prescriptionId } 
        });

        if (!resultat) {
            return res.status(404).json({ message: 'Résultats non trouvés' });
        }

        await resultat.update({
            valide: true,
            dateValidation: new Date()
        });

        // Marquer la prescription comme terminée
        await PrescriptionExamen.update(
            { statut: 'termine' },
            { where: { id: prescriptionId } }
        );

        res.status(200).json({ 
            message: 'Résultats validés avec succès', 
            resultat 
        });
    } catch (error) {
        console.error('Erreur lors de la validation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la validation', 
            error: error.message 
        });
    }
};

const getResultatsPatient = async (req, res) => {
    try {
        const { matricule } = req.params;

        const resultats = await ResultatExamen.findAll({
            include: [
                {
                    model: PrescriptionExamen,
                    where: { matriculePatient: matricule },
                    include: [TypeExamen]
                }
            ],
            order: [['dateRealisation', 'DESC']]
        });

        res.status(200).json({ resultats });
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des résultats', 
            error: error.message 
        });
    }
};

// Fonction utilitaire pour récupérer les infos patient
const getPatientInfo = async (matricule) => {
    try {
        const patientRecord = await patient.findOne({
            where: { matricule },
            include: [personne]
        });

        if (patientRecord && patientRecord.personne) {
            return {
                matricule,
                nom: patientRecord.personne.lastName,
                prenom: patientRecord.personne.firstName,
                sexe: patientRecord.personne.sex,
                dateNaissance: patientRecord.personne.birthDate,
                telephone: patientRecord.personne.tel,
                email: patientRecord.personne.email
            };
        }
        return null;
    } catch (error) {
        console.error('Erreur récupération info patient:', error);
        return null;
    }
};

// Statistiques du laboratoire
const getStatistiquesLab = async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.query;
        
        let whereClause = {};
        if (dateDebut && dateFin) {
            whereClause.datePrescription = {
                [Op.between]: [new Date(dateDebut), new Date(dateFin)]
            };
        }

        const stats = await PrescriptionExamen.findAll({
            where: whereClause,
            attributes: [
                'statut',
                [database.fn('COUNT', database.col('id')), 'count']
            ],
            group: ['statut']
        });

        const examensParCategorie = await PrescriptionExamen.findAll({
            where: whereClause,
            include: [TypeExamen],
            attributes: [
                [database.col('TypeExamen.categorie'), 'categorie'],
                [database.fn('COUNT', database.col('PrescriptionExamen.id')), 'count']
            ],
            group: ['TypeExamen.categorie']
        });

        res.status(200).json({ 
            statistiques: stats,
            examensParCategorie 
        });
    } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error);
        res.status(500).json({ 
            message: 'Erreur lors du calcul des statistiques', 
            error: error.message 
        });
    }
};

module.exports = {
    createTypeExamen,
    getAllTypesExamens,
    updateTypeExamen,
    addParametreToExamen,
    getPrescriptionsEnAttente,
    commencerExamen,
    saisirResultats,
    validerResultats,
    getResultatsPatient,
    getStatistiquesLab
};