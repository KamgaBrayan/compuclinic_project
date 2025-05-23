const consultation = require('../models/consultation');

const addPatientParameters =async (req,res)=>{

const { matricule, temperature, weight, height, pressure, symptomes, antecedents } = req.body;

try {
  // Récupérer la consultation la plus récente pour le patient
  const latestConsultation = await consultation.consultation.findOne({
    where: { matricule: matricule },
    order: [['createdAt', 'DESC']],
  });

  if (latestConsultation) {
    // Mettre à jour les informations de la consultation la plus récente
    await latestConsultation.update({
      temperature: temperature,
      weight: weight,
      height: height,
      pressure: pressure,
      symptomes: symptomes,
      antecedents: antecedents,
    });

    console.log('Consultation mise à jour avec succès');
    res.status(200).json({message:"Consultation mise à jour avec succès"});
  } else {
    console.log('Aucune consultation trouvée pour" ce patient');
    return res.status(404).json({ message: 'Aucune consultation trouvée pour ce patient' });
  }
} catch (error) {
  console.error('Erreur lors de la mise à jour de la consultation :', error);
  return res.status(500).json({ message: 'Erreur lors de la mise à jour de la consultation' });
}
}
module.exports = { addPatientParameters };