const express = require('express');
const laborantin = require('../controllers/controllerLaborantin');

const router = express.Router();

try {
  // Routes pour les types d'examens
  router.get("/types-examens", laborantin.getTypesExamens);
  router.post("/types-examens", laborantin.createTypeExamen);
  
  // Routes pour la gestion des examens
  router.get("/examens-payes", laborantin.getExamensPayes);
  router.put("/examens/:examenId/demarrer", laborantin.demarrerExamen);
  router.put("/examens/:examenId/resultats", laborantin.soumettreResultats);
  router.get("/examens-termines", laborantin.getExamensTermines);
  
} catch(e) {
  console.log("Une erreur est survenue dans la page route laborantin");
  console.log(e);
}

module.exports = router;