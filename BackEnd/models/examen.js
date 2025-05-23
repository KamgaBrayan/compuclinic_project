const { DataTypes, ENUM } = require('sequelize');
const database = require('../database');
const { patient } = require('./personne');

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
        values: ['Hématologie', 'Biochimie', 'Microbiologie', 'Imagerie', 'Parasitologie', 'Immunologie'],
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
        type: DataTypes.STRING
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
        type: DataTypes.DATE
    },
    dateRealisation: {
        type: DataTypes.DATE
    },
    resultats: {
        type: DataTypes.TEXT
    },
    observations: {
        type: DataTypes.TEXT
    },
    fichierResultat: {
        type: DataTypes.STRING // URL ou chemin du fichier PDF
    },
    priorite: {
        type: ENUM,
        values: ['Normal', 'Urgent', 'TrèsUrgent'],
        defaultValue: 'Normal'
    }
});

// Associations
examen.belongsTo(typeExamen);
examen.belongsTo(patient, { foreignKey: 'matricule', targetKey: 'matricule' });
examen.belongsTo(consultation);

typeExamen.hasMany(examen);
patient.hasMany(examen, { foreignKey: 'matricule' });
consultation.hasMany(examen);

module.exports = { typeExamen, examen };