const {DataTypes,ENUM, DATE} = require('sequelize');
const database = require('../database');


const typeMedicament=database.define('TypeMedicmament',
        {       nom:{type:DataTypes.STRING},
                description:{type:DataTypes.STRING},
        });

const medicament=database.define('médicaments',
        {   nom :{type:DataTypes.STRING},
            description:{type:DataTypes.STRING},
            pv:{type:DataTypes.FLOAT} 
        });

const stockMedicament = database.define('stockMedicament',
        {       dateArrivee:{type:DataTypes.DATE},
                datePeremption:{type:DataTypes.DATE},
                quantité:{type:DataTypes.INTEGER},
                commentaire:{type:DataTypes.STRING},
                prixAchatStock:{type:DataTypes.FLOAT},
        });

stockMedicament.belongsTo(medicament);
medicament.hasOne(stockMedicament);
medicament.belongsTo(typeMedicament);
typeMedicament.hasOne(medicament);


/*const historiquePharmacie = database.define('historique_pharmacie',
        {});*/

module.exports ={medicament,stockMedicament,typeMedicament};