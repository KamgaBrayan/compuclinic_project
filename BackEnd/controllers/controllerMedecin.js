const consultation = require('../models/consultation');
const personne = require('../models/personne');
const { TypeExamen, PrescriptionExamen } = require('../models/laboratoire');
const { PrescriptionMedicament, Ordonnance } = require('../models/prescription');
const { Drug } = require('../models/pharmacy');


const getPersonneById = async (id) => {
    try {
        const Checkpersonne = await personne.personne.findOne({
            where: { id: id }
        });

        if (Checkpersonne) {
            console.log(Checkpersonne);
            return Checkpersonne;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la personne :', error);
    }
};

const getPatientById = async (matriculeSend) => {
    try {    
        const Checkpatient = await personne.patient.findOne({
            where: {
                matricule: matriculeSend,
            }
        });
        console.log("le matricule est : ", matriculeSend);
        if (Checkpatient) {
            console.log("***************");
            const personneId = Checkpatient.personneId;
            console.log("***************", personneId);
            const personne = await (getPersonneById(personneId));
            console.log(personne);
            return (personne);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'id de la personne :', error);
    }
};

const updateConsultationResultById = async (req, res) => {
    console.log(req.body);
    const { matricule, prescription, diagnostique } = req.body;
    try {
        consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']]
        })
        .then(consultation => {
            if (consultation) {
                consultation.prescription = prescription
                consultation.diagnostique = diagnostique
                //enregistrer les modifications
                consultation.save()
                res.status(200).json({ message: "Parametres ajoutés avec success !" });
            } else {
                console.log('Aucune consultation trouvée avec ce matricule');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération :', error);
        });
    } catch (e) {
        console.error(e)
        console.error("erreur dans le controller Medecin");
    }
}

const getConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const consultationRecord = await consultation.consultation.findByPk(id, {
            
        });

        if (consultationRecord) {
            // Vous pourriez vouloir enrichir avec les infos patient comme dans getConsultations
            const patientInfo = await getPatientById(consultationRecord.matricule); // Votre fonction existante
            const enrichedConsultation = {
                ...consultationRecord.toJSON(),
                patientInfo: patientInfo ? {
                    lastName: patientInfo.lastName,
                    firstName: patientInfo.firstName,
                    sex: patientInfo.sex,
                    
                } : null
            };
            res.status(200).json(enrichedConsultation);
        } else {
            res.status(404).json({ message: "Consultation non trouvée" });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la consultation par ID:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};


const changeStateConsultation = async (req, res) => {
    const { matricule, statut } = req.body;
    try {
        consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']]
        }).then(consultation => {
            if (consultation) {
                consultation.statut = statut
                //enregistrer les modifications
                consultation.save()
                res.status(200).json({ message: "etat change avec success !" });
            } else {
                console.log('Aucune consultation trouvée avec ce matricule');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération :', error);
        });
    } catch (e) {
        console.error(e)
        console.error("erreur dans le controller Medecin");
    }
}

const getConsultations = async (req, res) => {
    try {
        const consultations = await consultation.consultation.findAll();
        // Boucler sur chaque consultation
        const consultationsWithPersonne = await Promise.all(consultations.map(async (consult) => {
            // Récupérer la personne associée à la consultation
            const personne = await getPatientById(consult.matricule);

            // Fusionner les informations de la consultation et de la personne
            return {
                ...consult.toJSON(),
                ...(personne ? {
                    lastName: personne.lastName,
                    firstName: personne.firstName,
                    sex: personne.sex,
                    tel: personne.tel,
                    cni: personne.cni,
                    email: personne.email,
                    adress: personne.adress,
                    birthDate: personne.birthDate,
                } : {
                    lastName: 'N/A',
                    firstName: 'N/A',
                    sex: 'N/A',
                    tel: 'N/A',
                    cni: 'N/A',
                    email: 'N/A',
                    adress: 'N/A',
                    birthDate: 'N/A',
                }),
            };
        }));

        // Retourner les consultations avec les informations de la personne
        res.send(consultationsWithPersonne);
    } catch (error) {
        console.error('Erreur lors de la récupération des consultations :', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des consultations' });
    }
}

// Nouvelles fonctions pour la prescription d'examens
const getTypesExamensDisponibles = async (req, res) => {
    try {
        const typesExamens = await TypeExamen.findAll({
            where: { disponible: true },
            order: [['categorie', 'ASC'], ['nom', 'ASC']]
        });

        res.status(200).json({ typesExamens });
    } catch (error) {
        console.error('Erreur lors de la récupération des types d\'examens:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des types d\'examens', 
            error: error.message 
        });
    }
};

const prescrireExamen = async (req, res) => {
    console.log("Backend - prescrireExamen - REÇU req.body:", req.body);
    try {
        const { 
            matriculePatient, 
            medecinId,          // Reçu du frontend
            consultationId,     // Reçu du frontend
            typeExamenId, 
            indication, 
            urgence = 'normale' 
        } = req.body;

        // --- VALIDATION DES INPUTS ---
        if (!matriculePatient) {
            console.error("Backend - prescrireExamen - Erreur: matriculePatient est manquant.");
            return res.status(400).json({ message: 'Le matricule du patient est requis.' });
        }
        if (!typeExamenId) {
            console.error("Backend - prescrireExamen - Erreur: typeExamenId est manquant.");
            return res.status(400).json({ message: 'Le type d\'examen est requis.' });
        }
        
        if (!medecinId) {
             console.warn("Backend - prescrireExamen - AVERTISSEMENT: medecinId est manquant/null. Si obligatoire, cela peut causer un problème d'intégrité ou être rejeté par la DB si la colonne n'est pas nullable.");
            // Si la colonne medecinId dans PrescriptionExamen a allowNull:false, ceci causera une erreur Sequelize plus tard.
        }
         if (!consultationId) {
             console.warn("Backend - prescrireExamen - AVERTISSEMENT: consultationId est manquant/null. Si obligatoire, cela peut causer un problème d'intégrité ou être rejeté par la DB si la colonne n'est pas nullable.");
        }


        // --- RECHERCHE DU PATIENT ---
        console.log(`Backend - prescrireExamen - Recherche du patient avec matricule: '${matriculePatient}'`);
        const patientRecord = await personne.patient.findOne({ 
            where: { matricule: matriculePatient }
            // attributes: ['id', 'matricule'] // Optionnel: ne récupérer que les champs nécessaires
        });

        if (!patientRecord) {
            console.error(`Backend - prescrireExamen - Patient non trouvé pour matricule: '${matriculePatient}'`);
            return res.status(404).json({ message: `Patient non trouvé avec le matricule '${matriculePatient}'.` });
        }
        console.log("Backend - prescrireExamen - Patient trouvé (objet complet):", JSON.stringify(patientRecord, null, 2));
        console.log("Backend - prescrireExamen - ID du patient à utiliser (patientRecord.id):", patientRecord.id); // CET ID DOIT ÊTRE VALIDE (pas null/undefined)


        // --- RECHERCHE DU TYPE D'EXAMEN ---
        const typeExamen = await TypeExamen.findByPk(typeExamenId);
        if (!typeExamen) {
            console.error(`Backend - prescrireExamen - TypeExamen non trouvé pour ID: '${typeExamenId}'`);
            return res.status(404).json({ message: 'Type d\'examen non trouvé.' });
        }
        console.log("Backend - prescrireExamen - TypeExamen trouvé:", typeExamen.nom);


        // --- VÉRIFICATION OPTIONNELLE MEDECINID ET CONSULTATIONID (EXISTENCE) ---
        if (medecinId) {
            const medecinExiste = await personne.employe.findByPk(medecinId);
            if (!medecinExiste) console.warn("Backend - prescrireExamen - medecinId fourni mais l'employé n'est pas trouvé en base:", medecinId);
        }
        if (consultationId) {
            const consultationExiste = await consultation.consultation.findByPk(consultationId);
            if (!consultationExiste) console.warn("Backend - prescrireExamen - consultationId fourni mais la consultation n'est pas trouvée en base:", consultationId);
        }


        // --- CRÉATION DE LA PRESCRIPTION ---
        console.log("Backend - prescrireExamen - Tentative de création de PrescriptionExamen avec patientId:", patientRecord.id, "medecinId:", medecinId, "consultationId:", consultationId);
        const prescription = await PrescriptionExamen.create({
            patientId: patientRecord.id,      // Doit être un ID valide de la table 'patients'
            medecinId: medecinId || null,     // Sera null si medecinId est falsy (undefined, null, '')
            consultationId: consultationId || null, // Sera null si consultationId est falsy
            typeExamenId,
            indication,
            urgence,
            prixTotal: typeExamen.prix,
            statut: 'prescrit'
        });
        console.log("Backend - prescrireExamen - Prescription créée avec succès (ID):", prescription.id, "avec patientId:", prescription.patientId);


        // --- RÉCUPÉRATION DE LA PRESCRIPTION COMPLÈTE POUR LA RÉPONSE ---
        const prescriptionComplete = await PrescriptionExamen.findByPk(prescription.id, {
            include: [
                TypeExamen, 
                { 
                    model: personne.patient, 
                    attributes: ['id', 'matricule'], // Sélectionner les attributs nécessaires
                    include: [{
                        model: personne.personne,
                        attributes: ['firstName', 'lastName', 'sex', 'birthDate'] // Sélectionner les attributs nécessaires
                    }]
                }
                // Tu pourrais aussi inclure le médecin si tu as la relation et medecinId
                // { model: EmployeModel, as: 'medecinPrescripteur' } // (si l'alias est 'medecinPrescripteur')
            ]
        });

        res.status(201).json({ 
            message: 'Examen prescrit avec succès', 
            prescription: prescriptionComplete 
        });

    } catch (error) {
        console.error('Backend - Erreur DÉTAILLÉE dans prescrireExamen:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Erreur de validation des données.', 
                errors: error.errors.map(e => ({ field: e.path, message: e.message }))
            });
        }
        // Pour toute autre erreur, c'est une erreur serveur
        res.status(500).json({ 
            message: 'Erreur serveur interne lors de la prescription d\'examen.', 
            errorDetails: error.message // Fournir un peu plus de détails peut aider au débogage frontend
        });
    }
};

const getPrescriptionsExamenPatient = async (req, res) => {
    try {
        const { matricule } = req.params;

        const prescriptions = await PrescriptionExamen.findAll({
            where: { matriculePatient: matricule },
            include: [TypeExamen],
            order: [['datePrescription', 'DESC']]
        });

        res.status(200).json({ prescriptions });
    } catch (error) {
        console.error('Erreur lors de la récupération des prescriptions:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des prescriptions', 
            error: error.message 
        });
    }
};

// Nouvelles fonctions pour la prescription de médicaments
const getMedicamentsDisponibles = async (req, res) => {
    try {
        const { search, category } = req.query;
        
        let whereClause = { stock: { [require('sequelize').Op.gt]: 0 } };
        
        if (search) {
            whereClause[require('sequelize').Op.or] = [
                { name: { [require('sequelize').Op.like]: `%${search}%` } },
                { genericName: { [require('sequelize').Op.like]: `%${search}%` } }
            ];
        }

        const medicaments = await Drug.findAll({
            where: whereClause,
            order: [['name', 'ASC']]
        });

        res.status(200).json({ medicaments });
    } catch (error) {
        console.error('Erreur lors de la récupération des médicaments:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des médicaments', 
            error: error.message 
        });
    }
};

const creerOrdonnance = async (req, res) => {
    console.log("Backend - creerOrdonnance - REÇU req.body:", req.body);
    try {
        const { 
            matriculePatient, 
            medecinId, 
            consultationId, 
            medicaments, 
            instructions 
        } = req.body;

        // --- VALIDATION DES INPUTS ---
        if (!matriculePatient) {
            console.error("Backend - creerOrdonnance - Erreur: matriculePatient est manquant.");
            return res.status(400).json({ message: 'Le matricule du patient est requis.' });
        }
        if (!medicaments || medicaments.length === 0) {
            console.error("Backend - creerOrdonnance - Erreur: La liste des médicaments est vide.");
            return res.status(400).json({ message: 'Au moins un médicament doit être prescrit.' });
        }
        // Ajouter des validations pour medecinId, consultationId si nécessaire

        // --- RECHERCHE DU PATIENT ---
        console.log(`Backend - creerOrdonnance - Recherche du patient avec matricule: '${matriculePatient}'`);
        // Utilise le nom de variable correct pour ton modèle Patient (PatientModel ou patient)
        const patientRecord = await personne.patient.findOne({ // Ou PatientModel.findOne
            where: { matricule: matriculePatient }
        });

        if (!patientRecord) {
            console.error(`Backend - creerOrdonnance - Patient non trouvé pour matricule: '${matriculePatient}'`);
            return res.status(404).json({ message: `Patient non trouvé avec le matricule '${matriculePatient}'.` });
        }
        console.log("Backend - creerOrdonnance - Patient trouvé (ID):", patientRecord.id);


        // Générer un numéro d'ordonnance unique
        const numeroOrdonnance = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Créer l'ordonnance
        console.log("Backend - creerOrdonnance - Création Ordonnance avec patientId:", patientRecord.id);
        const ordonnance = await Ordonnance.create({
            numeroOrdonnance,
            patientId: patientRecord.id, // << UTILISER L'ID DU PATIENT TROUVÉ
            medecinId: medecinId || null,
            consultationId: consultationId || null,
            instructions,
            dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        });
        console.log("Backend - creerOrdonnance - Ordonnance créée (ID):", ordonnance.id);


        // Créer les prescriptions de médicaments associées
        const prescriptionsMedicamentsPromises = medicaments.map(async (med) => {
            if (!med.medicamentId) {
                console.error("Backend - creerOrdonnance - medicamentId manquant pour un médicament:", med);
                // Peut-être lancer une erreur ou ignorer ce médicament
                return null; // Ou gérer autrement
            }
            return PrescriptionMedicament.create({
                ordonnanceId: ordonnance.id,
                patientId: patientRecord.id, // << UTILISER L'ID DU PATIENT TROUVÉ
                medecinId: medecinId || null,
                consultationId: consultationId || null,
                medicamentId: med.medicamentId, // Vient du payload frontend
                posologie: med.posologie,
                quantitePrescrite: med.quantite, // Assure-toi que 'quantite' est bien le nom de la prop dans le payload 'med'
                dureeTraitement: med.dureeTraitement,
                instructions: med.instructions
            });
        });
        
        const prescriptionsMedicaments = (await Promise.all(prescriptionsMedicamentsPromises)).filter(p => p !== null); // Filtrer les nulls si on a ignoré des médocs
        console.log(`Backend - creerOrdonnance - ${prescriptionsMedicaments.length} PrescriptionMedicament créées.`);


        // Récupérer l'ordonnance complète pour la réponse
        const ordonnanceComplete = await Ordonnance.findByPk(ordonnance.id, {
            include: [
                {
                    model: PrescriptionMedicament,
                    include: [Drug] // Assure-toi que Drug est bien le modèle Sequelize
                },
                // Tu pourrais aussi vouloir inclure le patient ici pour la réponse
                {
                    model: personne.patient, // Ou PatientModel
                    include: [personne.personne] // Ou PersonneModel
                }
            ]
        });

        res.status(201).json({ 
            message: 'Ordonnance créée avec succès', 
            ordonnance: ordonnanceComplete 
        });

    } catch (error) {
        console.error('Backend - Erreur DÉTAILLÉE dans creerOrdonnance:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Erreur de validation des données pour l\'ordonnance.', 
                errors: error.errors.map(e => ({ field: e.path, message: e.message }))
            });
        }
        res.status(500).json({ 
            message: 'Erreur serveur interne lors de la création de l\'ordonnance.', 
            errorDetails: error.message 
        });
    }
};

const getOrdonnancesPatient = async (req, res) => {
    try {
        const { matricule } = req.params;

        const ordonnances = await Ordonnance.findAll({
            where: { matriculePatient: matricule },
            include: [
                {
                    model: PrescriptionMedicament,
                    include: [Drug]
                }
            ],
            order: [['dateOrdonnance', 'DESC']]
        });

        res.status(200).json({ ordonnances });
    } catch (error) {
        console.error('Erreur lors de la récupération des ordonnances:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des ordonnances', 
            error: error.message 
        });
    }
};

const getOrdonnanceActivePourConsultation = async (req, res) => {
    try {
        const { consultationId } = req.params;
        console.log(`Backend - getOrdonnanceActivePourConsultation - consultationId: ${consultationId}`);

        const ordonnance = await Ordonnance.findOne({
            where: { 
                consultationId: consultationId,
                // Tu pourrais ajouter un filtre sur le statut de l'ordonnance si pertinent (ex: statut: 'active')
            },
            include: [
                {
                    model: PrescriptionMedicament,
                    include: [Drug] // Assure-toi que Drug est bien le modèle importé
                },
                // Optionnel: inclure le patient et le médecin si besoin pour l'affichage de l'ordonnance
            ],
            order: [['dateOrdonnance', 'DESC']] // Prendre la plus récente si plusieurs possibles
        });

        if (!ordonnance) {
            // Ce n'est pas nécessairement une erreur 404, il se peut qu'aucune ordonnance n'ait été faite
            console.log(`Backend - Aucune ordonnance active trouvée pour consultationId: ${consultationId}`);
            return res.status(200).json({ message: 'Aucune ordonnance médicamenteuse trouvée pour cette consultation.', ordonnance: null });
        }

        console.log("Backend - Ordonnance active trouvée:", JSON.stringify(ordonnance, null, 2).substring(0, 500) + "...");
        res.status(200).json({ ordonnance });

    } catch (error) {
        console.error('Backend - Erreur dans getOrdonnanceActivePourConsultation:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la récupération de l\'ordonnance.', 
            errorDetails: error.message 
        });
    }
};

const getPrescriptionsExamensPourConsultation = async (req, res) => {
    try {
        const { consultationId } = req.params;
        console.log(`Backend - getPrescriptionsExamensPourConsultation - consultationId: ${consultationId}`);

        const prescriptionsExamens = await PrescriptionExamen.findAll({
            where: { 
                consultationId: consultationId 
                // Tu pourrais ajouter un filtre sur le statut si pertinent (ex: statut != 'annule')
            },
            include: [
                TypeExamen, // Inclure les détails du TypeExamen
                // Optionnel: inclure le patient et le médecin
            ],
            order: [['datePrescription', 'ASC']]
        });

        if (!prescriptionsExamens || prescriptionsExamens.length === 0) {
            console.log(`Backend - Aucune prescription d'examen trouvée pour consultationId: ${consultationId}`);
            return res.status(200).json({ message: 'Aucun examen prescrit pour cette consultation.', prescriptionsExamens: [] });
        }
        
        console.log(`Backend - ${prescriptionsExamens.length} prescriptions d'examens trouvées.`);
        res.status(200).json({ prescriptionsExamens });

    } catch (error) {
        console.error('Backend - Erreur dans getPrescriptionsExamensPourConsultation:', error);
        res.status(500).json({ 
            message: 'Erreur serveur lors de la récupération des prescriptions d\'examens.', 
            errorDetails: error.message 
        });
    }
};

module.exports = { 
    updateConsultationResultById, 
    getConsultations, 
    changeStateConsultation,
    getConsultationById,
    // Nouvelles fonctions pour examens
    getTypesExamensDisponibles,
    prescrireExamen,
    getPrescriptionsExamenPatient,
    // Nouvelles fonctions pour médicaments
    getMedicamentsDisponibles,
    creerOrdonnance,
    getOrdonnancesPatient,

    getOrdonnanceActivePourConsultation,
    getPrescriptionsExamensPourConsultation
};