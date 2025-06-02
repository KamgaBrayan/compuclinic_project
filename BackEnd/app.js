const express = require('express');
const database = require('./database');

// Import des modèles pour s'assurer qu'ils sont initialisés
const { personne, employe, poste, patient } = require('./models/personne.js');
const { Tservice, Tconsultation, Texamen, Toperation } = require('./models/service');
const { consultation } = require('./models/consultation');
const { historiqueCaisse, caisse } = require('./models/caisse');
const { medicament, stockMedicament, typeMedicament } = require('./models/pharmacie');
const { Drug, DrugDosage } = require('./models/pharmacy');
const { TypeExamen, PrescriptionExamen, ResultatExamen, ParametreExamen } = require('./models/laboratoire');
const { PrescriptionMedicament, DispensationMedicament, Ordonnance } = require('./models/prescription');

// Import des routes
const routeSecretaire = require('./routes/routeSecretaire');
const routeMedecin = require("./routes/routeMedecin");
const routeInfirmiere = require("./routes/routeInfirmiere");
const routePharmacy = require("./routes/routePharmacy");
const routeLaborantin = require("./routes/routeLaborantin");

const app = express();
app.use(express.json());

// Configuration CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Configuration des routes
app.use("/api/secretaire", routeSecretaire);
app.use("/api/medecin", routeMedecin);
app.use("/api/infirmiere", routeInfirmiere);
app.use("/api/pharmacy", routePharmacy);
app.use("/api/laborantin", routeLaborantin);

// Connexion à la base de données et synchronisation des modèles
const initializeDatabase = async () => {
  try {
    console.log('🔄 Connexion à la base de données...');
    
    // Test de connexion
    await database.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Synchronisation des modèles (création des tables)
    console.log('🔄 Synchronisation des modèles...');
    
    await database.sync({ 
      // alter: true // Utilisez cette option pour mettre à jour les tables existantes
      // force: true // Attention: cette option supprime et recrée toutes les tables
    });
    
    console.log('✅ Synchronisation des modèles terminée');
    console.log('📋 Tables créées/vérifiées:');
    console.log('   - Tables personnes (personne, employe, poste, patient)');
    console.log('   - Tables services (Tservice, Tconsultation, Texamen, Toperation)');
    console.log('   - Table consultation');
    console.log('   - Tables caisse (caisse, historiqueCaisse)');
    console.log('   - Tables pharmacie ancienne (medicament, stockMedicament, typeMedicament)');
    console.log('   - Tables pharmacy nouvelle (Drug, DrugDosage)');
    console.log('   - Tables laboratoire (TypeExamen, PrescriptionExamen, ResultatExamen, ParametreExamen)');
    console.log('   - Tables prescription (PrescriptionMedicament, DispensationMedicament, Ordonnance)');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};

// Initialisation de la base de données
initializeDatabase().then(() => {
  // Démarrage du serveur seulement après l'initialisation de la DB
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
    console.log('🏥 CompuClinic Backend - Prêt à recevoir les requêtes');
    console.log('\n📋 Endpoints disponibles:');
    console.log('   • /api/secretaire - Gestion des patients');
    console.log('   • /api/medecin - Consultations et prescriptions');
    console.log('   • /api/infirmiere - Paramètres patients');
    console.log('   • /api/pharmacy - Gestion pharmacie et stocks');
    console.log('   • /api/laborantin - Gestion examens et résultats');
  });
}).catch((error) => {
  console.error('❌ Erreur fatale lors du démarrage:', error);
  process.exit(1);
});

// Gestion gracieuse de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🔄 Arrêt gracieux du serveur...');
  try {
    await database.close();
    console.log('✅ Connexion à la base de données fermée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture:', error);
    process.exit(1);
  }
});

module.exports = app;