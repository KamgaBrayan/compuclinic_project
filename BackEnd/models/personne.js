const {DataTypes,ENUM, DATE} = require('sequelize');
const database = require('../database');

const personne = database.define('personne', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    sex: {
        type: ENUM,
        values: ['M', 'F']
    },
    tel: {
        type: DataTypes.STRING,  
        allowNull: true
    },
    cni: {
        type: DataTypes.STRING,   
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthDate: {
        type: DataTypes.DATE
    },
    service: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const employe=database.define('employe',
    {salaire_ajout:{type:DataTypes.FLOAT}});

const poste=database.define('poste',
    {   lastName :{type:DataTypes.STRING},
        salaire_minimal:{type:DataTypes.INTEGER},
    });

const patient = database.define('patient',
    {matricule:{type:DataTypes.STRING},});

    // association 

employe.belongsTo(personne);
employe.belongsTo(poste);
patient.belongsTo(personne);

personne.hasOne(employe);
personne.hasOne(patient);
poste.hasOne(employe);



module.exports = {personne,employe,poste,patient};