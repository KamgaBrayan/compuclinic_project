/*ici il s'agit des services qu'offres l'hopital*/

const {DataTypes,ENUM, DATE} = require('sequelize');
const database = require('../database');

const Tservice=database.define('Tservice',
        {type :{type:ENUM, values:['consultation','examen','operation','medicament']}});

const Tconsultation=database.define('Tconsultation',
        {   nom :{type:DataTypes.STRING},
            prix:{type:DataTypes.FLOAT},
            etat:{type:DataTypes.BOOLEAN},// un type de consultation 1 est disponible , 0 indisponible
        });

const Texamen=database.define('Texamen',
        {   nom :{type:DataTypes.STRING},
            prix:{type:DataTypes.FLOAT},
            etat:{type:DataTypes.BOOLEAN},
        });

const Toperation=database.define('Toperation',
        {   nom :{type:DataTypes.STRING},
            prix:{type:DataTypes.FLOAT},
            etat:{type:DataTypes.BOOLEAN},
        });

module.exports = {Tservice,Tconsultation,Texamen,Toperation};