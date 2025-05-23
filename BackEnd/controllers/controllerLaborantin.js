const { typeExamen, examen } = require('../models/examen');
const { patient } = require('../models/personne');
const { consultation } = require('../models/consultation');
const { Op } = require('sequelize');

// Récupérer tous les types d'examens disponibles
const getTypesExamens = async (req, res) => {
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

// Créer un nouveau type d'examen
const createTypeExamen = async (req, res) => {
    try {
        const { nom, categorie, prix, dureeEstimee, description } = req.body;
        
        const nouveauType = await typeExamen.create({
            nom,
            categorie,
            prix,
            dureeEstimee,
            description
        });
        
        res.status(201).json({
            message: 'Type d\'examen créé avec succès',
            data: nouveauType
        });
    } catch (error) {
        console.error('Erreur lors de la création du type d\'examen:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les examens payés (pour le laborantin)
const getExamensPayes = async (req, res) => {
    try {
        const examens = await examen.findAll({
            where: { 
                statut: 'Payé'
            },
            include: [
                {
                    model: typeExamen,
                    attributes: ['nom', 'categorie', 'dureeEstimee']
                },
                {
                    model: patient,
                    attributes: ['matricule'],
                    include: [{
                        model: require('../models/personne').personne,
                        attributes: ['firstName', 'lastName', 'birthDate', 'sex']
                    }]
                },
                {
                    model: consultation,
                    attributes: ['id', 'createdAt']
                }
            ],
            order: [
                ['priorite', 'DESC'],
                ['datePaiement', 'ASC']
            ]
        });
        
        res.status(200).json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Commencer un examen
const demarrerExamen = async (req, res) => {
    try {
        const { examenId } = req.params;
        
        const examenToUpdate = await examen.findByPk(examenId);
        if (!examenToUpdate) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }
        
        await examenToUpdate.update({
            statut: 'EnCours',
            dateRealisation: new Date()
        });
        
        res.status(200).json({
            message: 'Examen démarré',
            data: examenToUpdate
        });
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'examen:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Soumettre les résultats d'un examen
const soumettreResultats = async (req, res) => {
    try {
        const { examenId } = req.params;
        const { resultats, observations, fichierResultat } = req.body;
        
        const examenToUpdate = await examen.findByPk(examenId);
        if (!examenToUpdate) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }
        
        await examenToUpdate.update({
            statut: 'Terminé',
            resultats,
            observations,
            fichierResultat
        });
        
        res.status(200).json({
            message: 'Résultats soumis avec succès',
            data: examenToUpdate
        });
    } catch (error) {
        console.error('Erreur lors de la soumission des résultats:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer l'historique des examens terminés
const getExamensTermines = async (req, res) => {
    try {
        const examens = await examen.findAll({
            where: { 
                statut: 'Terminé',
                dateRealisation: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
                }
            },
            include: [
                {
                    model: typeExamen,
                    attributes: ['nom', 'categorie']
                },
                {
                    model: patient,
                    attributes: ['matricule'],
                    include: [{
                        model: require('../models/personne').personne,
                        attributes: ['firstName', 'lastName']
                    }]
                }
            ],
            order: [['dateRealisation', 'DESC']]
        });
        
        res.status(200).json(examens);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getTypesExamens,
    createTypeExamen,
    getExamensPayes,
    demarrerExamen,
    soumettreResultats,
    getExamensTermines
};