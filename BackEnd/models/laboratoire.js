// BackEnd/models/laboratoire.js
const { DataTypes, ENUM } = require('sequelize');
const database = require('../database');
const { personne, patient } = require('./personne');
const { consultation } = require('./consultation');

// Types d'examens disponibles
const TypeExamen = database.define('TypeExamen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dureeEstimee: { // en minutes
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    necessitePrevision: { // si le patient doit être à jeun, etc.
        type: DataTypes.TEXT
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    categorie: {
        type: ENUM('hematologie', 'biochimie', 'microbiologie', 'parasitologie', 'immunologie', 'radiologie', 'echographie', 'autre'),
        allowNull: false
    }
});

// Prescriptions d'examens par le médecin
const PrescriptionExamen = database.define('PrescriptionExamen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    matriculePatient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    medecinId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    consultationId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    typeExamenId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    indication: { // raison de la prescription
        type: DataTypes.TEXT
    },
    urgence: {
        type: ENUM('normale', 'urgente', 'tres_urgente'),
        defaultValue: 'normale'
    },
    statut: {
        type: ENUM('prescrit', 'paye', 'en_cours', 'termine', 'annule'),
        defaultValue: 'prescrit'
    },
    datePrescription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dateRealisation: {
        type: DataTypes.DATE
    },
    observations: {
        type: DataTypes.TEXT
    }
});

// Résultats d'examens
const ResultatExamen = database.define('ResultatExamen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    prescriptionExamenId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    laborantinId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    resultats: {
        type: DataTypes.JSON // Pour stocker les résultats structurés
    },
    interpretation: {
        type: DataTypes.TEXT
    },
    valeursAnormales: {
        type: DataTypes.JSON // Pour marquer les valeurs hors normes
    },
    commentaires: {
        type: DataTypes.TEXT
    },
    fichierResultat: { // chemin vers un fichier PDF ou image
        type: DataTypes.STRING
    },
    dateRealisation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    valide: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dateValidation: {
        type: DataTypes.DATE
    }
});

// Paramètres d'examens (pour les examens qui ont des paramètres mesurables)
const ParametreExamen = database.define('ParametreExamen', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    typeExamenId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unite: {
        type: DataTypes.STRING // mg/dl, g/l, etc.
    },
    valeurMinNormale: {
        type: DataTypes.FLOAT
    },
    valeurMaxNormale: {
        type: DataTypes.FLOAT
    },
    typeValeur: {
        type: ENUM('numerique', 'texte', 'positif_negatif', 'present_absent'),
        defaultValue: 'numerique'
    },
    obligatoire: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Relations
TypeExamen.hasMany(PrescriptionExamen, { foreignKey: 'typeExamenId' });
PrescriptionExamen.belongsTo(TypeExamen, { foreignKey: 'typeExamenId' });

TypeExamen.hasMany(ParametreExamen, { foreignKey: 'typeExamenId' });
ParametreExamen.belongsTo(TypeExamen, { foreignKey: 'typeExamenId' });

PrescriptionExamen.hasOne(ResultatExamen, { foreignKey: 'prescriptionExamenId' });
ResultatExamen.belongsTo(PrescriptionExamen, { foreignKey: 'prescriptionExamenId' });

// Relations avec les modèles existants
PrescriptionExamen.belongsTo(patient, { foreignKey: 'matriculePatient', targetKey: 'matricule' });
PrescriptionExamen.belongsTo(consultation, { foreignKey: 'consultationId' });

module.exports = {
    TypeExamen,
    PrescriptionExamen,
    ResultatExamen,
    ParametreExamen
};