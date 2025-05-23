const consultation = require('../models/consultation');
const personne = require('../models/personne');


const getPersonneById = async (id) => {
    try {
        const Checkpersonne = await personne.personne.findOne({
            where: {
                id:id,
            }
        });

        if (Checkpersonne) {
          console.log(Checkpersonne);
            return Checkpersonne;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la personne de la personne :', error);
       
    }
};


const getPatientById = async (matriculeSend) => {
    try{    
            
            const  Checkpatient = await personne.patient.findOne({
              where: {
                  matricule: matriculeSend,
              }
            });
            console.log("le matricule est : ",matriculeSend);
          if (Checkpatient) {
              console.log("***************");
              const personneId= Checkpatient.personneId;
              console.log("***************",personneId);
              const personne = await (getPersonneById(personneId));
              console.log(personne);
              return(personne);
          } else {
              return null;
          }
      } catch (error) {
          console.error('Erreur lors de la récupération de l\'id de la personne :', error);
         // return null;
      }
  };


const updateConsultationResultById = async (req, res) => {
    console.log(req.body);
    const {matricule, prescription, diagnostique} = req.body;
    try{
        consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']]
        })
        .then(consultation => {
            if (consultation) {
                consultation.prescription = prescription
                consultation.diagnostique = diagnostique
                //enregistrer les modifications
                consultation.save()
                res.status(200).json({message:"Parametres ajoutés avec success !"});
            } else {
                console.log('Aucune consultation trouvée avec ce matricule');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération :', error);
        });
    }catch(e){
        console.error(e)
        console.error("erreur dans le controller Medecin");  
    }
    
}

const changeStateConsultation = async (req,res) => {
    const {matricule, statut} = req.body;
    try {
        consultation.consultation.findOne({
            where: { matricule: matricule },
            order: [['createdAt', 'DESC']]
        }).then(consultation => {
            if (consultation) {
                consultation.statut = statut
                //enregistrer les modifications
                consultation.save()
                res.status(200).json({message:"etat change avec success !"});
            } else {
                console.log('Aucune consultation trouvée avec ce matricule');
            }
        })
            .catch(error => {
                console.error('Erreur lors de la récupération :', error);
            });
    }catch(e){
        console.error(e)
        console.error("erreur dans le controller Medecin");
    }
}

const getConsultations = async (req, res) =>{
    try{
        const consultations = await consultation.consultation.findAll();
        // Boucler sur chaque consultation
  const consultationsWithPersonne = await Promise.all(consultations.map(async (consult) => {
    // Récupérer la personne associée à la consultation
    const personne = await getPatientById(consult.matricule);

    // Fusionner les informations de la consultation et de la personne
    return {
      ...consult.toJSON(),
      ...(personne ? {
        lastName: personne.lastName,
        firstName: personne.firstName,
        sex: personne.sex,
        tel: personne.tel,
        cni: personne.cni,
        email: personne.email,
        adress: personne.adress,
        birthDate: personne.birthDate,
      } : {
        lastName: 'N/A',
        firstName: 'N/A',
        sex: 'N/A',
        tel: 'N/A',
        cni: 'N/A',
        email: 'N/A',
        adress: 'N/A',
        birthDate: 'N/A',
      }),
    };
  }));

  // Retourner les consultations avec les informations de la personne
   res.send(consultationsWithPersonne);
} catch (error) {
  console.error('Erreur lors de la récupération des consultations :', error);
  return res.status(500).json({ message: 'Erreur lors de la récupération des consultations' });

   
}
}

module.exports = { updateConsultationResultById, getConsultations, changeStateConsultation };