const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('compuclinic', 'root', '',/* db name*, db user name , db us  pw*/
 { 
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;