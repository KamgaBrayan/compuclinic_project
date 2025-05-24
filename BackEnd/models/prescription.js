// BackEnd/models/prescription.js
const { DataTypes, ENUM } = require('sequelize');
const database = require('../database');
const { Drug } = require('./pharmacy');
const { patient } = require('./personne');
const { consultation } = require('./consultation');

// Prescription médicamenteuse détaillée
const PrescriptionMedicament = database.define('PrescriptionMedicament', {
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
    medicamentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    posologie: {
        type: DataTypes.STRING,
        allowNull: false // ex: "2 comprimés 3 fois par jour"
    },
    quantitePrescrite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dureeTraitement: {
        type: DataTypes.INTEGER // en jours
    },
    instructions: {
        type: DataTypes.TEXT // ex: "à prendre avant les repas"
    },
    statut: {
        type: ENUM('prescrit', 'partiellement_servi', 'entierement_servi', 'annule'),
        defaultValue: 'prescrit'
    },
    datePrescription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Détail de dispensation pharmacie
const DispensationMedicament = database.define('DispensationMedicament', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    prescriptionMedicamentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    pharmacienId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantiteDispensee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prixUnitaire: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sousTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dateDispensation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    observations: {
        type: DataTypes.TEXT
    }
});

// Ordonnance globale
const Ordonnance = database.define('Ordonnance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    numeroOrdonnance: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
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
    dateOrdonnance: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    instructions: {
        type: DataTypes.TEXT
    },
    statut: {
        type: ENUM('active', 'partiellement_executee', 'entierement_executee', 'expiree', 'annulee'),
        defaultValue: 'active'
    },
    dateExpiration: {
        type: DataTypes.DATE
    }
});

// Relations
Ordonnance.hasMany(PrescriptionMedicament, { foreignKey: 'ordonnanceId' });
PrescriptionMedicament.belongsTo(Ordonnance, { foreignKey: 'ordonnanceId' });

PrescriptionMedicament.belongsTo(Drug, { foreignKey: 'medicamentId' });
Drug.hasMany(PrescriptionMedicament, { foreignKey: 'medicamentId' });

PrescriptionMedicament.hasMany(DispensationMedicament, { foreignKey: 'prescriptionMedicamentId' });
DispensationMedicament.belongsTo(PrescriptionMedicament, { foreignKey: 'prescriptionMedicamentId' });

// Relations avec modèles existants
Ordonnance.belongsTo(patient, { foreignKey: 'matriculePatient', targetKey: 'matricule' });
Ordonnance.belongsTo(consultation, { foreignKey: 'consultationId' });

PrescriptionMedicament.belongsTo(patient, { foreignKey: 'matriculePatient', targetKey: 'matricule' });
PrescriptionMedicament.belongsTo(consultation, { foreignKey: 'consultationId' });

module.exports = {
    PrescriptionMedicament,
    DispensationMedicament,
    Ordonnance
};