const express = require('express');
const medecin = require('../controllers/controllerMedecin');
const ia = require('../controllers/controllerGemini');

const router = express.Router();

try {
  // Routes existantes
  router.put("/updateResultConsultation", medecin.updateConsultationResultById);
  router.put("/changestate", medecin.changeStateConsultation);
  router.get("/getConsultations", medecin.getConsultations);
  router.get("/getGemini", ia.gemini);
  
  // Nouvelles routes pour les examens
  router.get("/types-examens", medecin.getTypesExamensDisponibles);
  router.post("/prescrire-examen", medecin.prescrireExamen);
  router.get("/prescriptions-examens/:matricule", medecin.getPrescriptionsExamenPatient);
  
  // Nouvelles routes pour les médicaments
  router.get("/medicaments", medecin.getMedicamentsDisponibles);
  router.post("/creer-ordonnance", medecin.creerOrdonnance);
  router.get("/ordonnances/:matricule", medecin.getOrdonnancesPatient);
  
} catch(e) {
  console.log("une erreur est survenue dans la page route medecin");
  console.log(e);
  console.log("une erreur est survenue dans la page route medecin");
}

module.exports = router;