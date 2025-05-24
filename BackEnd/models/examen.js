const { DataTypes, ENUM } = require('sequelize');
const database = require('../database');
const { patient } = require('./personne');
const { consultation } = require('./consultation');

// Types d'examens disponibles dans l'hôpital
const typeExamen = database.define('typeExamen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categorie: {
        type: ENUM,
        values: ['Hématologie', 'Biochimie', 'Microbiologie', 'Imagerie', 'Parasitologie', 'Immunologie', 'Cardiologie', 'Urologie'],
        allowNull: false
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dureeEstimee: {
        type: DataTypes.INTEGER, // en minutes
        defaultValue: 60
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    description: {
        type: DataTypes.TEXT
    },
    prerequis: {
        type: DataTypes.TEXT, // Par exemple: "Patient à jeun", "Arrêt de certains médicaments"
        allowNull: true
    },
    materielNecessaire: {
        type: DataTypes.TEXT, // Équipements/matériels nécessaires
        allowNull: true
    }
});

// Examens prescrits pour un patient
const examen = database.define('examen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    matricule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    consultationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statut: {
        type: ENUM,
        values: ['Prescrit', 'Payé', 'EnCours', 'Terminé', 'Annulé'],
        defaultValue: 'Prescrit'
    },
    datePresciption: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    datePaiement: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateRealisation: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dateResultat: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resultats: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    observations: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fichierResultat: {
        type: DataTypes.STRING, // URL ou chemin du fichier PDF/image
        allowNull: true
    },
    priorite: {
        type: ENUM,
        values: ['Normal', 'Urgent', 'TrèsUrgent'],
        defaultValue: 'Normal'
    },
    prescripteur: {
        type: DataTypes.STRING, // Nom du médecin prescripteur
        allowNull: true
    },
    laborantin: {
        type: DataTypes.STRING, // Nom du laborantin qui a effectué l'examen
        allowNull: true
    },
    commentaireMedecin: {
        type: DataTypes.TEXT, // Commentaires du médecin lors de la prescription
        allowNull: true
    }
});

// Associations
examen.belongsTo(typeExamen, {
    foreignKey: 'typeExamenId',
    as: 'typeExamen'
});

examen.belongsTo(patient, { 
    foreignKey: 'matricule', 
    targetKey: 'matricule',
    as: 'patient'
});

examen.belongsTo(consultation.consultation, {
    foreignKey: 'consultationId',
    as: 'consultation'
});

typeExamen.hasMany(examen, {
    foreignKey: 'typeExamenId',
    as: 'examens'
});

patient.hasMany(examen, { 
    foreignKey: 'matricule',
    sourceKey: 'matricule',
    as: 'examens'
});

consultation.consultation.hasMany(examen, {
    foreignKey: 'consultationId',
    as: 'examens'
});

module.exports = { typeExamen, examen };