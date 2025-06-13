const { TypeExamen, PrescriptionExamen, ResultatExamen, ParametreExamen } = require('../models/laboratoire');
const personne = require('../models/personne');
const { consultation } = require('../models/consultation');
const { Op } = require('sequelize');
const database = require('../database');

// Gestion des types d'examens
const createTypeExamen = async (req, res) => {
    try {
        const { nom, code, description, prix, dureeEstimee, necessitePrevision, categorie, laborantinId } = req.body;
        
        // Vérifier si le code existe déjà
        const existingType = await TypeExamen.findOne({ where: { code } });
        if (existingType) {
            return res.status(400).json({ message: 'Ce code d\'examen existe déjà' });
        }
        
        const nouveauType = await TypeExamen.create({
            nom,
            code,
            description,
            prix: prix || 0,
            dureeEstimee: dureeEstimee || 30,
            necessitePrevision,
            categorie: categorie || 'autre',
            laborantinId
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
        const { disponible, categorie, laborantinId } = req.query;
        
        let whereClause = {};
        if (disponible !== undefined) whereClause.disponible = disponible === 'true';
        if (categorie) whereClause.categorie = categorie;
        if (laborantinId) whereClause.laborantinId = laborantinId;
        
        const types = await TypeExamen.findAll({
            where: whereClause,
            include: [
                {
                    model: ParametreExamen,
                    order: [['ordreAffichage', 'ASC']]
                }
            ],
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

const deleteTypeExamen = async (req, res) => {
    try {
        const { id } = req.params;
        
        const typeExamen = await TypeExamen.findByPk(id);
        if (!typeExamen) {
            return res.status(404).json({ message: 'Type d\'examen non trouvé' });
        }
        
        // Vérifier s'il y a des prescriptions liées
        const prescriptionsExistantes = await PrescriptionExamen.count({
            where: { typeExamenId: id }
        });
        
        if (prescriptionsExistantes > 0) {
            return res.status(400).json({ 
                message: 'Impossible de supprimer ce type d\'examen car il y a des prescriptions associées' 
            });
        }
        
        await typeExamen.destroy();
        res.status(200).json({ message: 'Type d\'examen supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression', 
            error: error.message 
        });
    }
};

// Gestion des paramètres d'examens
const addParametreToExamen = async (req, res) => {
    try {
        const { typeExamenId } = req.params;
        const { nom, unite, valeurMinNormale, valeurMaxNormale, typeValeur, obligatoire, ordreAffichage } = req.body;

        const typeExamen = await TypeExamen.findByPk(typeExamenId);
        if (!typeExamen) {
            return res.status(404).json({ message: 'Type d\'examen non trouvé' });
        }

        const parametre = await ParametreExamen.create({
            typeExamenId,
            nom,
            unite,
            valeurMinNormale,
            valeurMaxNormale,
            typeValeur: typeValeur || 'numerique',
            obligatoire: obligatoire !== false,
            ordreAffichage: ordreAffichage || 0
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

const getParametresExamen = async (req, res) => {
    try {
        const { typeExamenId } = req.params;
        
        const parametres = await ParametreExamen.findAll({
            where: { typeExamenId },
            order: [['ordreAffichage', 'ASC'], ['nom', 'ASC']]
        });
        
        res.status(200).json({ parametres });
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des paramètres', 
            error: error.message 
        });
    }
};

const updateParametreExamen = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const parametre = await ParametreExamen.findByPk(id);
        if (!parametre) {
            return res.status(404).json({ message: 'Paramètre non trouvé' });
        }
        
        await parametre.update(updates);
        res.status(200).json({ 
            message: 'Paramètre mis à jour avec succès', 
            parametre 
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du paramètre:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la mise à jour du paramètre', 
            error: error.message 
        });
    }
};

const deleteParametreExamen = async (req, res) => {
    try {
        const { id } = req.params;
        
        const parametre = await ParametreExamen.findByPk(id);
        if (!parametre) {
            return res.status(404).json({ message: 'Paramètre non trouvé' });
        }
        
        await parametre.destroy();
        res.status(200).json({ message: 'Paramètre supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du paramètre:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du paramètre', 
            error: error.message 
        });
    }
};

// Gestion des prescriptions d'examens
/*
const getPrescriptionsEnAttente = async (req, res) => {
    try {
        let statutsDemandés = req.query.statut || 'prescrit';
        if (!Array.isArray(statutsDemandés)) {
            statutsDemandés = [statutsDemandés];
        }
        console.log("Laborantin Backend - getPrescriptionsEnAttente - Statuts demandés:", statutsDemandés);

        const { urgence, categorie } = req.query;
        
        let whereClause = {};
        if (statutsDemandés.length > 0) {
            whereClause.statut = { [Op.in]: statutsDemandés };
        }
        if (urgence) whereClause.urgence = urgence;
        
        let includeTypeExamenClause = {
            model: TypeExamen,
            include: [ParametreExamen]
        };
        if (categorie) {
            includeTypeExamenClause.where = { categorie };
        }
        
        const prescriptions = await PrescriptionExamen.findAll({
            where: whereClause,
            include: [
                includeTypeExamenClause,
                {
                    // Utiliser les noms importés (patient et personne, ou PatientModel et PersonneModel si tu as utilisé des alias)
                    model: personne.patient,   // << CORRIGÉ
                    required: false,
                    include: [
                        personne.personne  // << CORRIGÉ
                    ]
                }
                // Tu pourrais aussi inclure les infos du médecin prescripteur si 'employe' est importé
                // et que l'association est définie avec un alias (ex: 'medecinPrescripteur')
                // { model: employe, as: 'medecinPrescripteur', include: [personne] }
            ],
            order: [['urgence', 'DESC'], ['datePrescription', 'ASC']]
        });
        console.log("Laborantin Backend - Prescriptions trouvées:", prescriptions.length);

        const prescriptionsMappees = prescriptions.map(p => {
            const presJson = p.toJSON();
            // La structure patientInfo est importante pour le frontend TablePrescriptionsLab.js
            return {
                ...presJson, // Contient déjà TypeExamen, patient (avec personne nichée)
                patientInfo: { 
                    matricule: presJson.patient?.matricule,
                    nom: presJson.patient?.personne?.lastName,
                    prenom: presJson.patient?.personne?.firstName,
                    sexe: presJson.patient?.personne?.sex,
                    dateNaissance: presJson.patient?.personne?.birthDate,
                }
            };
        });

        res.status(200).json({ prescriptions: prescriptionsMappees });
    } catch (error) {
        console.error('Laborantin Backend - Erreur getPrescriptionsEnAttente:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des prescriptions', 
            error: error.message 
        });
    }
};
*/

const getPrescriptionsEnAttente = async (req, res) => {
    console.log("Laborantin Backend - getPrescriptionsEnAttente - Récupération de TOUTES les prescriptions");
    try {
        // On ignore req.query.statut, req.query.urgence, req.query.categorie pour cette version de test

        const prescriptions = await PrescriptionExamen.findAll({
            // PAS DE CLAUSE 'where' POUR LE STATUT
            include: [
                {
                    model: TypeExamen, // Inclure les détails du type d'examen
                    include: [ParametreExamen] // Et les paramètres de ce type d'examen
                },
                {
                    model: personne.patient,   // Inclure le modèle patient
                    required: false,  // Mettre à false pour s'assurer de récupérer la prescription même si le patient a un souci (pour débogage)
                                      // Idéalement, required: true est mieux si les données sont propres.
                    include: [
                        { model: personne.personne } // Inclure le modèle personne lié au patient
                    ]
                },
                // Optionnel : Inclure le médecin prescripteur si l'association est définie
                // {
                //     model: employe, // Supposant que 'employe' est le modèle pour les médecins
                //     as: 'medecin', // 'medecin' doit être l'alias défini dans PrescriptionExamen.belongsTo(employe, { as: 'medecin', ...})
                //     include: [personne] // Pour avoir nom/prénom du médecin
                // }
            ],
            order: [['datePrescription', 'DESC']] // Trier par date de prescription la plus récente
        });

        console.log(`Laborantin Backend - Nombre total de prescriptions trouvées (sans filtre de statut): ${prescriptions.length}`);
        if (prescriptions.length > 0) {
            console.log("Laborantin Backend - Détail première prescription (brute):", JSON.stringify(prescriptions[0], null, 2));
        }

        // Mappage pour structurer 'patientInfo' comme le frontend l'attend
        const prescriptionsMappees = prescriptions.map(p => {
            const presJson = p.toJSON(); // Convertit l'instance Sequelize en objet simple
            return {
                ...presJson, // Toutes les propriétés de la prescription et ses inclusions directes (TypeExamen)
                patientInfo: presJson.patient ? { // Si l'inclusion du patient a fonctionné
                    matricule: presJson.patient.matricule,
                    nom: presJson.patient.personne?.lastName || 'N/A', // Utiliser optional chaining
                    prenom: presJson.patient.personne?.firstName || 'N/A',
                    sexe: presJson.patient.personne?.sex,
                    dateNaissance: presJson.patient.personne?.birthDate,
                } : null, // Si le patient n'a pas été trouvé (à cause de required: false et d'un problème de données)
                // Le champ TypeExamen sera déjà niché correctement par Sequelize : presJson.TypeExamen
            };
        });

        res.status(200).json({ prescriptions: prescriptionsMappees });

    } catch (error) {
        console.error('Laborantin Backend - Erreur dans getPrescriptionsEnAttente (toutes):', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération de toutes les prescriptions', 
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

const getResultatById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resultat = await ResultatExamen.findByPk(id, {
            include: [
                {
                    model: PrescriptionExamen,
                    include: [
                        {
                            model: TypeExamen,
                            include: [ParametreExamen]
                        }
                    ]
                }
            ]
        });
        
        if (!resultat) {
            return res.status(404).json({ message: 'Résultat non trouvé' });
        }
        
        res.status(200).json({ resultat });
    } catch (error) {
        console.error('Erreur lors de la récupération du résultat:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du résultat', 
            error: error.message 
        });
    }
};

// Fonction utilitaire pour récupérer les infos patient
const getPatientInfo = async (matricule) => {
    try {
        const patientRecord = await personne.patient.findOne({
            where: { matricule },
            include: [personne.personne]
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
    deleteTypeExamen,
    addParametreToExamen,
    getParametresExamen,
    updateParametreExamen,
    deleteParametreExamen,
    getPrescriptionsEnAttente,
    commencerExamen,
    saisirResultats,
    validerResultats,
    getResultatsPatient,
    getResultatById,
    getStatistiquesLab
};