const express = require('express');
const secretaire = require('../controllers/controllerSecretaire');

const router = express.Router();
/*
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Route protégée accessible uniquement avec un jeton valide' });
});*/ 

try {
  router.post("/addUnExistingPatient", secretaire.addUnExistingPatient);
  router.get("/getPatientById", secretaire.getOnePatientById);
  router.get("/getPatientById/:matricule", secretaire.getOnePatientByMatriculeParam);
  router.get("/getPatients", secretaire.getAllPatients);
  router.post("/addConsultation",secretaire.addConsultation);
  router.put("/updatePatientById",secretaire.updatePatientById);
  router.delete("/deletePatientById/:matricule", secretaire.deletePatientById);

} catch(e) {
  console.log("une erreur est survenue");
  console.log(e);
}


module.exports = router;