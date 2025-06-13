const {DataTypes,ENUM, DATE} = require('sequelize');
const database = require('../database');
const {Tservice} = require('./service');
const { patient } = require('./personne.js');

const caisse=database.define('caisse',
        {   nom :{type:DataTypes.STRING}, 
        });

const historiqueCaisse = database.define('historiqueCaisse',
        {
         TypeService: {type:DataTypes.STRING},
         nomService :{type:DataTypes.STRING},
         quantité: {type:DataTypes.INTEGER},
         date :{type:DataTypes.DATE},
         paiement:{type:ENUM,values:['cash','orangeMoney','mobileMoney']},
        });

        historiqueCaisse.belongsTo(Tservice);
        historiqueCaisse.belongsTo(patient);
        Tservice.hasOne(historiqueCaisse);
        patient.hasOne(historiqueCaisse);
        historiqueCaisse.belongsTo(caisse);
        caisse.hasOne(historiqueCaisse);
        

module.exports ={historiqueCaisse,caisse};