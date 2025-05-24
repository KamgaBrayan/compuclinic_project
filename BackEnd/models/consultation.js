const { DataTypes, ENUM, DATE } = require('sequelize');
const database = require('../database');
const personne = require('./personne');
const { Tconsultation } = require('./service');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

const consultation = database.define('consultation',
    {
        matricule: { type: DataTypes.STRING },
        temperature: { type: DataTypes.INTEGER },
        weight: { type: DataTypes.FLOAT },
        height: { type: DataTypes.FLOAT },
        pressure: { type: DataTypes.FLOAT },
        symptomes: { type: DataTypes.STRING },
        antecedents: { type: DataTypes.STRING },
        diagnostique: { type: DataTypes.STRING },
        prescription: { type: DataTypes.STRING },
        commentaire: { type: DataTypes.STRING },
        date_debut: { type: DataTypes.DATE },
        date_fin: { type: DataTypes.DATE },
        statut: {
            type: ENUM, 
            values: ['EnAttente', 'EnCours', 'Terminer'],
            defaultValue: "EnAttente"
        },
    }
);

// Relations existantes
consultation.belongsTo(personne.patient);
consultation.belongsTo(personne.employe);
consultation.belongsTo(Tconsultation);

personne.patient.hasMany(consultation);
personne.employe.hasMany(consultation);
Tconsultation.hasMany(consultation);

// Nouvelles relations avec les examens - à définir après l'import du modèle examen
// Note: Les relations avec examen seront établies dans le modèle examen.js pour éviter les imports circulaires

module.exports = { consultation };