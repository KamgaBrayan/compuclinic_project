
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
                                type: ENUM, values: ['EnAttente', 'EnCours', 'Terminer'],
                                defaultValue: "EnAttente"
                        },
                });

        consultation.belongsTo(personne.patient);
        consultation.belongsTo(personne.employe);
        consultation.belongsTo(Tconsultation);
        personne.patient.hasOne(consultation);
        personne.employe.hasOne(consultation);
        Tconsultation.hasOne(consultation);

        module.exports = { consultation };

