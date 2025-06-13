const express = require('express');
const laborantinController = require('../controllers/controllerLaborantin');
const pharmacyController = require('../controllers/controllerPharmacy'); // Import du controller pharmacie

const router = express.Router();

try {
  // Gestion des types d'examens
  router.post('/types-examens', laborantinController.createTypeExamen);
  router.get('/types-examens', laborantinController.getAllTypesExamens);
  router.put('/types-examens/:id', laborantinController.updateTypeExamen);
  router.delete('/types-examens/:id', laborantinController.deleteTypeExamen);

  // Gestion des paramètres d'examens
  router.post('/types-examens/:typeExamenId/parametres', laborantinController.addParametreToExamen);
  router.get('/types-examens/:typeExamenId/parametres', laborantinController.getParametresExamen);
  router.put('/parametres/:id', laborantinController.updateParametreExamen);
  router.delete('/parametres/:id', laborantinController.deleteParametreExamen);

  // Gestion des prescriptions d'examens
  router.get('/prescriptions', laborantinController.getPrescriptionsEnAttente);
  router.put('/prescriptions/:id/commencer', laborantinController.commencerExamen);
  router.post('/prescriptions/:prescriptionId/resultats', laborantinController.saisirResultats);
  router.put('/prescriptions/:prescriptionId/valider', laborantinController.validerResultats);

  // Consultation des résultats
  router.get('/resultats/patient/:matricule', laborantinController.getResultatsPatient);
  router.get('/resultats/:id', laborantinController.getResultatById);

  // Statistiques du laboratoire
  router.get('/statistiques', laborantinController.getStatistiquesLab);

  // ========== NOUVELLES ROUTES POUR CONSULTATION PHARMACIE ==========
  // Routes en lecture seule pour que le laborantin puisse consulter la pharmacie
  router.get('/pharmacie/drugs', pharmacyController.getAllDrugs);
  router.get('/pharmacie/drugs/search', pharmacyController.searchDrugs);
  router.get('/pharmacie/drugs/:id', pharmacyController.getDrugById);
  router.get('/pharmacie/drugs/:drugId/dosage', pharmacyController.getDrugDosages);
  router.get('/pharmacie/drugs/low-stock', pharmacyController.getLowStockDrugs);
  router.get('/pharmacie/statistics', pharmacyController.getPharmacyStatistics);

} catch (e) {
  console.error('Erreur dans les routes laborantin:', e);
}

module.exports = router;