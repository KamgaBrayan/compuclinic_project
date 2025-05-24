const express = require('express');
const medecin = require('../controllers/controllerMedecin');
const ia = require('../controllers/controllerGemini');

const router = express.Router();

try {
  router.put("/updateResultConsultation", medecin.updateConsultationResultById);
  router.put("/changestate", medecin.changeStateConsultation);
  router.get("/getConsultations", medecin.getConsultations);
  router.get("/getGemini",ia.gemini);
} catch(e) {
  console.log("une erreur est survenue dans la page route medecin");
  console.log(e);
  console.log("une erreur est survenue dans la page route medecin");
}

module.exports = router;