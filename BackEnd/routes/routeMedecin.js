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
  router.post("/prescrire-examens", medecin.prescrireExamens);
  router.get("/examens/:consultationId", medecin.getExamensConsultation);
  router.get("/types-examens", medecin.getTypesExamensDisponibles);
  router.get("/resultats-examens/:matricule", medecin.getResultatsExamens);
  
} catch(e) {
  console.log("Une erreur est survenue dans la page route medecin");
  console.log(e);
}

module.exports = router;