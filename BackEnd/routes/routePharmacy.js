const express = require('express');
const pharmacyController = require('../controllers/controllerPharmacy');

const router = express.Router();

try {
  // Routes pour les médicaments (gestion du stock)
  router.post('/drugs', pharmacyController.createDrug);
  router.put('/drugs/:id', pharmacyController.editDrug);
  router.delete('/drugs/:id', pharmacyController.deleteDrug);
  router.get('/drugs/search', pharmacyController.searchDrugs);
  router.get('/drugs', pharmacyController.getAllDrugs);
  router.get('/drugs/:id', pharmacyController.getDrugById);
  router.post('/drugs/:drugId/dosage', pharmacyController.addDrugDosage);
  router.get('/drugs/:drugId/dosage', pharmacyController.getDrugDosages);
  
  // Routes pour la gestion des stocks
  router.put('/drugs/:id/stock', pharmacyController.updateDrugStock);
  router.get('/drugs/low-stock', pharmacyController.getLowStockDrugs);
  
  // Routes pour les ordonnances et dispensations
  router.get('/ordonnances', pharmacyController.getAllOrdonnances);
  router.get('/ordonnances/:id', pharmacyController.getOrdonnanceById);
  router.post('/prescriptions/:prescriptionId/dispenser', pharmacyController.dispenserMedicament);
  
  // Routes pour les statistiques
  router.get('/statistics', pharmacyController.getPharmacyStatistics);
  
} catch (e) {
  console.error('Error setting up pharmacy routes:', e);
}

module.exports = router;