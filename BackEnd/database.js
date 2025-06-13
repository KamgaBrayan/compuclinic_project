const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('compuclinic', 'davy_shadow', '#19102004Davy',/* db name*, db user name , db us  pw*/
 { 
  host: 'localhost',
  dialect: 'mariadb',
    logging: false,
});

// Test de la connexion
sequelize.authenticate()
    .then(() => {
      console.log('Connexion réussie à la base de données MariaDB.');
    })
    .catch((error) => {
      console.error('Impossible de se connecter à la base de données:', error);
    });

module.exports = sequelize;