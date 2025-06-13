const express = require('express');
const infirmiere = require('../controllers/controllerInfirmiere');

const router = express.Router();

try {
  router.put("/addPatientParameters", infirmiere.addPatientParameters)
} catch(e) {
  console.log("une erreur est survenue dans la page route medecin");
  console.log(e);
  console.log("une erreur est survenue dans la page route medecin");
}

module.exports = router;