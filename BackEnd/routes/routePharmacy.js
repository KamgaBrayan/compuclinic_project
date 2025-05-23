const express = require('express');
const pharmacyController = require('../controllers/controllerPharmacy'); // Import the pharmacy controller

const router = express.Router();

try {
  // Routes pour les médicaments
  router.post('/drugs', pharmacyController.createDrug);
  router.put('/drugs/:id', pharmacyController.editDrug);
  router.delete('/drugs/:id', pharmacyController.deleteDrug);
  router.get('/drugs/search', pharmacyController.searchDrugs);
  router.get('/drugs', pharmacyController.getAllDrugs);
  router.get('/drugs/:id', pharmacyController.getDrugById);
  router.post('/drugs/:drugId/dosage', pharmacyController.addDrugDosage);
  router.get('/drugs/:drugId/dosage', pharmacyController.getDrugDosages);

  // Routes pour les factures
  /*
  router.post('/invoices', pharmacyController.createInvoice);
  router.get('/invoices', pharmacyController.getAllInvoices);
  router.get('/invoices/search', pharmacyController.searchInvoices);
  router.get('/invoices/:id', pharmacyController.getInvoiceById);
  router.put('/invoices/:id/status', pharmacyController.updateInvoiceStatus);
  */
} catch (e) {
  console.error('Error setting up pharmacy routes:', e);
}

module.exports = router;