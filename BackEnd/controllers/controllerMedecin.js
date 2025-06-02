// BackEnd/controllers/controllerMedecin.js - Version étendue
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
            // Inclure les associations nécessaires si besoin (patient, médecin, etc.)
            // include: [
            //     { model: personne.patient, include: [personne.personne] },
            //     { model: personne.employe, include: [personne.personne] } 
            // ]
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
                    // ... autres champs de personne
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
    try {
        const { 
            matriculePatient, 
            medecinId, 
            consultationId, 
            typeExamenId, 
            indication, 
            urgence = 'normale' 
        } = req.body;

        // Vérifier que le type d'examen existe
        const typeExamen = await TypeExamen.findByPk(typeExamenId);
        if (!typeExamen) {
            return res.status(404).json({ message: 'Type d\'examen non trouvé' });
        }

        // Vérifier que le patient existe
        const patientExiste = await personne.patient.findOne({
            where: { matricule: matriculePatient }
        });
        if (!patientExiste) {
            return res.status(404).json({ message: 'Patient non trouvé' });
        }

        const prescription = await PrescriptionExamen.create({
            matriculePatient,
            medecinId,
            consultationId,
            typeExamenId,
            indication,
            urgence,
            prixTotal: typeExamen.prix,
            statut: 'prescrit'
        });

        // Récupérer la prescription avec les détails
        const prescriptionComplete = await PrescriptionExamen.findByPk(prescription.id, {
            include: [TypeExamen]
        });

        res.status(201).json({ 
            message: 'Examen prescrit avec succès', 
            prescription: prescriptionComplete 
        });
    } catch (error) {
        console.error('Erreur lors de la prescription d\'examen:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la prescription d\'examen', 
            error: error.message 
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
    try {
        const { 
            matriculePatient, 
            medecinId, 
            consultationId, 
            medicaments, 
            instructions 
        } = req.body;

        // Générer un numéro d'ordonnance unique
        const numeroOrdonnance = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Créer l'ordonnance
        const ordonnance = await Ordonnance.create({
            numeroOrdonnance,
            matriculePatient,
            medecinId,
            consultationId,
            instructions,
            dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
        });

        // Créer les prescriptions de médicaments
        const prescriptionsMedicaments = await Promise.all(
            medicaments.map(async (med) => {
                return await PrescriptionMedicament.create({
                    ordonnanceId: ordonnance.id,
                    matriculePatient,
                    medecinId,
                    consultationId,
                    medicamentId: med.medicamentId,
                    posologie: med.posologie,
                    quantitePrescrite: med.quantite,
                    dureeTraitement: med.dureeTraitement,
                    instructions: med.instructions
                });
            })
        );

        // Récupérer l'ordonnance complète
        const ordonnanceComplete = await Ordonnance.findByPk(ordonnance.id, {
            include: [
                {
                    model: PrescriptionMedicament,
                    include: [Drug]
                }
            ]
        });

        res.status(201).json({ 
            message: 'Ordonnance créée avec succès', 
            ordonnance: ordonnanceComplete 
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'ordonnance:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création de l\'ordonnance', 
            error: error.message 
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
    getOrdonnancesPatient
};