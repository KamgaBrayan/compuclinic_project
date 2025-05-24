const express = require('express');
const database = require('./database');
const { personne, employe, poste, patient } = require('./models/personne.js');
const { Tservice, Tconsultation, Texamen, Toperation } = require('./models/service');
const { consultation } = require('./models/consultation');
const { historiqueCaisse, caisse } = require('./models/caisse');
const { medicament, stockMedicament, typeMedicament } = require('./models/pharmacie');
const { Drug, DrugDosage} = require('./models/pharmacy');
const { typeExamen, examen } = require('./models/examen'); // Ajout des modèles d'examen

const routeSecretaire = require('./routes/routeSecretaire');
const routeMedecin = require("./routes/routeMedecin");
const routeInfirmiere = require("./routes/routeInfirmiere");
const routePharmacy = require("./routes/routePharmacy");
const routeLaborantin = require("./routes/routeLaborantin"); // Ajout de la route laborantin

const app = express();
app.use(express.json());

// Connexion à la base de données
database
  .sync()
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à la base de données :', error);
  });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/secretaire", routeSecretaire);
app.use("/api/medecin", routeMedecin);
app.use("/api/infirmiere", routeInfirmiere);
app.use("/api/pharmacy", routePharmacy);
app.use("/api/laborantin", routeLaborantin); // Ajout de la route laborantin

console.log("Serveur configuré avec toutes les routes");

app.listen(8000, () => {
  console.log('Serveur démarré sur le port 8000');
});