const personne = require('../models/personne');
const consultation = require('../models/consultation');
//const axios = require('axios');

const matriculePatient = (Idpersonne) => {
    // Récupérer la date courante
    const currentDate = new Date();
    // Transformer la date en une chaîne de caractères au format "YYYYMMDD"
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    // Concaténer l'ID et la date pour obtenir le matricule
    const matricule = `${dateString}${Idpersonne}`;
    return (matricule);
};

const getPersonneIdByName = async (firstName, lastName) => {
    try {
        const Checkpersonne = await personne.personne.findOne({
            where: {
                lastName: firstName,
                firstName: lastName
            }
        });

        if (Checkpersonne) {
            return Checkpersonne.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'id de la personne :', error);
        return null;
    }
};

const getPersonneById = async (id) => {
    try {
        const Checkpersonne = await personne.personne.findOne({
            where: {
                id: id,
            }
        });

        if (Checkpersonne) {
            console.log(Checkpersonne);
            return Checkpersonne;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la personne de la personne :', error);

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
        // return null;
    }
};

const getOnePatientById = async (req, res) => {
    //ici on recherche le patient par son matricule . 
    const matricule = req.body;
    const patient = await getPatientById(matricule.matricule);
    res.send(patient);
}

const getPatientByPersonneId = async (id) =>
{
    const patient = await personne.patient.findOne({ where: { personneId: id } });
    return patient;
}

const getPatients = async () => {
    try {
        const patients = await personne.patient.findAll();
        const idsPatients = patients.personneId;
        const personnes = await personne.personne.findAll({ id: [idsPatients] });

        const personneWithmatricule = await Promise.all(personnes.map(async (personne) => {
            const patient = await getPatientByPersonneId(personne.id);
            return {
                ...personne.toJSON(),
                ...(patient ? {
                    matricule: patient.matricule,
                    service: personne.service || 'Not Assigned'
                } : {
                    matricule: 'N/A',
                    service: 'Not Assigned'
                }),
            };
        }));

        return personneWithmatricule;
    }
    catch (err) { console.log(err); }
}

const getAllPatients = async (req, res) => {
    try {
        console.log("test getAllpatients");
        const personnes = await getPatients();

        console.log("les personnes", personnes);
        res.send(personnes);
    } catch (error) {

        res.status(500).send("Erreur lors de la récupération des patients");
    }
};

const addUnExistingPatient = async (req, res) => {
    try {
        const { firstName, lastName, birthDate, sex, service, tel, email, cni, adress } = req.body;  
        console.log("Creating patient with data:", req.body);

        //on verifie si le patient existe par son lastName et son firstName existe
        const personneId = await (getPersonneIdByName(firstName, lastName));
        if (personneId) {
            return res.status(409).json({ message: "le patient existe déja " });
        }
        else {
            // Create the person record with all fields
            const newPersonne = await personne.personne.create({ 
                lastName: firstName, 
                firstName: lastName, 
                birthDate: birthDate, 
                sex: sex,
                service: service || null,  // Allow null service
                tel: tel || null,
                email: email || null,
                cni: cni || null,
                adress: adress || null  // Note: using 'adress' as per model definition
            });
            
            const personneId = await (getPersonneIdByName(firstName, lastName));
            const matricule = matriculePatient(personneId);

            try {
                // Create the patient record
                if (personneId) {
                    const newPatient = await personne.patient.create({ 
                        personneId: personneId, 
                        matricule: matricule
                    });
                    
                    // If it's a consultation service, create consultation record
                    if (service === "consultation") {
                        try {
                            const newconsultation = await consultation.consultation.create({ 
                                matricule: matricule 
                            });
                        } catch (err) {
                            console.error("Error creating consultation:", err);
                        }
                    }

                    // Get the complete patient data and return
                    const patient = await getPatientById(matricule);
                    if (patient) {
                        patient.service = service || 'Not Assigned';  // Set default service
                    }
                    res.status(201).json({ patient });
                }
            } catch (err) { 
                console.error("Error adding patient:", err);
                res.status(500).json({ message: "Error adding patient", error: err.message });
            }
        }
    }
    catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ message: "Error adding patient", error: err.message });
    }
};

const updatePatientById = async (req, res) =>
{
    try {
        const { matricule, firstName, lastName, birthDate, sex, service, tel, email, cni, adress } = req.body;
        const patient = await getPatientById(matricule);
        const idPatient = await patient.id;
        console.log("************************************", patient);
        const newPersonne = await personne.personne.update({ 
            lastName: firstName, 
            firstName: lastName,
            birthDate: birthDate, 
            sex: sex, 
            service: service,
            tel: tel || null,
            email: email || null,
            cni: cni || null,
            adress: adress || null  // Note: using 'adress' as per model definition
        },
        { where: { id: idPatient } });
        res.status(200).json({ message: "mise à jour du patient réussi" });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating patient", error: err.message });
    }
};

const addConsultation = async (req, res) => {
    const { matriculePatient, serviceName } = req.body;
    if (serviceName == "consultation") {
        try {
            const newconsultation = await consultation.consultation.create({ matricule: matriculePatient });
            // res.status(201).json({ message: "la consultation a été enregistrer avec succès" });
            res.status(201).json({ message: "le patient et la consultation ont été ajouter avec succès" });

        } catch (e) {
            res.status(500).json({ message: "une erreur est survenue lors de l'enregistrement de la consultation" });
            console.log("une erreur est survenue lors de l'enregistrement de la consultation");
            console.log(err);
        }
    }

    else {
        console.log("serviceName != consultation");
    }

}

const getOnePatientByMatriculeParam = async (req, res) => {
    try {
        const { matricule } = req.params; // Lire depuis les paramètres d'URL
        const patientData = await getPatientById(matricule); // Votre fonction existante getPatientById
        if (patientData) {
            res.status(200).json(patientData);
        } else {
            res.status(404).json({ message: "Patient non trouvé" });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du patient par matricule param:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const deletePatientById = async (req, res) => {
    try {
        const matricule = req.params.matricule; // Changed from req.body to req.params
        console.log("Deleting patient with matricule:", matricule);

        // Find the patient first
        const patient = await personne.patient.findOne({
            where: { matricule: matricule }
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Get the personne ID
        const personneId = patient.personneId;

        // Delete the patient record first (due to foreign key constraint)
        await personne.patient.destroy({
            where: { matricule: matricule }
        });

        // Then delete the personne record
        await personne.personne.destroy({
            where: { id: personneId }
        });

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            message: "An error occurred while deleting the patient",
            error: error.message
        });
    }
}

module.exports = { addUnExistingPatient, getOnePatientById, getAllPatients, addConsultation, updatePatientById, deletePatientById, getOnePatientByMatriculeParam };

/*


const AddOneContact = async (req, res) => {
    try {
        const { name, number, operator } = req.body;

        console.log(req.body);


        // Vérifier si le contact existe déjà
        const existingContact = await contact.findOne({ where: { number: number } });
        if (existingContact) {
            return res.status(409).json({ message: Le contact existe déjà });
        }
        // Créer un nouveau contact
        const newContact = await contact.create({ name, number, operator });

        res.status(201).json({ message: Contact ajouté avec succès, contact: newContact });
    } catch (error) {
        console.error(Erreur lors de l'ajout du contact :, error);
        res.status(500).json({ message: Erreur lors de l'ajout du contact });
    }
};


const getOneContact = async (req, res) => {
    try {
        const { CId } = req.body; //CId: contact Id

        const contact = await Contact.findByPk(CId);
        if (!contact) {
            return res.status(401).json({ message: Aucun Contact trouvé });
        }

        res.json({ contact });
    }
    catch (error) {
        console.error(Erreur lors de la recuperation du contact:, error);
        res.status(500).json({ message: Erreur lors de la recuperation du contact });
    }
};


const getManyContacts = async (req, res) => {
    try {
        const { CIds } = req.body;

        const contacts = await Contact.findByPk(CIds);
        if (!contacts || contacts.length === 0) {
            return res.status(401).json({ message: Aucun contact trouvé });
        }

        res.json({ contacts });
    }
    catch (error) {
        console.error(Erreur lors de la recuperation du contact:, error);
        res.status(500).json({ message: Erreur lors de la recuperation du contact });
    }
};


const updateContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { name, number } = req.body;

        // Rechercher le contact par ID
        const contact = await Contact.findByPk(contactId);

        if (!contact) {
            return res.status(404).json({ message: Contact introuvable });
        }

        // Mettre à jour les propriétés du contact
        contact.name = name;
        contact.number = number;
        await contact.save();

        res.json({ message: Contact mis à jour avec succès, contact });
    } catch (error) {
        console.error(Erreur lors de la mise à jour du contact :, error);
        res.status(500).json({ message: Erreur lors de la mise à jour du contact });
    }
};


const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        // Rechercher le contact par ID
        const contact = await Contact.findByPk(contactId);

        if (!contact) {
            return res.status(404).json({ message: Contact introuvable });
        }

        // Supprimer le contact
        await contact.destroy();

        res.json({ message: Contact supprimé avec succès });
    } catch (error) {
        console.error(Erreur lors de la suppression du contact :, error);
        res.status(500).json({ message: Erreur lors de la suppression du contact });
    }
};
*/
