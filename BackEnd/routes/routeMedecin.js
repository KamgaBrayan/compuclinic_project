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
  router.post("/gemini", ia.gemini2); // Changer GET en POST
  router.get("/consultation/:id", medecin.getConsultationById);
  
  // Nouvelles routes pour les examens
  router.get("/types-examens", medecin.getTypesExamensDisponibles);
  router.post("/prescrire-examen", medecin.prescrireExamen);
  router.get("/prescriptions-examens/:matricule", medecin.getPrescriptionsExamenPatient);
  
  // Nouvelles routes pour les médicaments
  router.get("/medicaments", medecin.getMedicamentsDisponibles);
  router.post("/creer-ordonnance", medecin.creerOrdonnance);
  router.get("/ordonnances/:matricule", medecin.getOrdonnancesPatient);

  router.get("/consultations/:consultationId/ordonnance-active", medecin.getOrdonnanceActivePourConsultation);

  // Route pour récupérer les prescriptions d'examens d'une consultation
  router.get("/consultations/:consultationId/prescriptions-examens", medecin.getPrescriptionsExamensPourConsultation);
  
} catch(e) {
  console.log("une erreur est survenue dans la page route medecin");
  console.log(e);
  console.log("une erreur est survenue dans la page route medecin");
}

module.exports = router;