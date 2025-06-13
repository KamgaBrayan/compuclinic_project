// --- START OF FILE SaisirResultatsExamenModal.js ---
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; // Ajustez le chemin
import { useNotification } from '../../reducers/NotificationContext';

// Hook pour récupérer les paramètres d'un type d'examen
const useGetParametresExamen = (typeExamenId, enabled) => {
    return useQuery(
        ['parametresExamen', typeExamenId],
        async () => {
            const { data } = await axios.get(wServer.GET.LABORANTIN.TYPES_EXAMENS_PARAMETRES(typeExamenId));
            return Array.isArray(data.parametres) ? data.parametres : [];
        },
        {
            enabled: enabled && !!typeExamenId, // N'exécuter que si le modal est ouvert et typeExamenId est disponible
            staleTime: 10 * 60 * 1000, // Cache pour 10 minutes
        }
    );
};

// Hook pour récupérer un résultat d'examen existant (si on modifie)
const useGetResultatExistant = (prescriptionId, enabled) => {
    return useQuery(
        ['resultatExistant', prescriptionId],
        async () => {
            // Il faut une route pour GET /resultats/prescription/:prescriptionId ou similaire
            // Pour l'instant, on suppose qu'elle n'existe pas et qu'on crée toujours un nouveau ResultatExamen
            // Si elle existe, on l'appellerait ici.
            // Exemple: const { data } = await axios.get(`/api/laborantin/resultats/prescription/${prescriptionId}`);
            // return data.resultat; 
            return null; // Simuler qu'aucun résultat n'existe pour l'instant
        },
        {
            enabled: enabled && !!prescriptionId,
        }
    );
};


// Hook pour la mutation de saisie/mise à jour des résultats
const useSaisirOuMajResultatsExamen = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ prescriptionId, resultatData, isUpdate, resultatExistantId }) => {
      let response;
      // Le backend attend laborantinId dans le body
      const payload = { ...resultatData, laborantinId: "ID_LAB_CONNECTE_SI_BESOIN" }; // REMPLACER L'ID

      if (isUpdate && resultatExistantId) {
        // Il faudrait une route PUT /api/laborantin/resultats/:resultatId
        // response = await axios.put(`${wServer.PUT.LABORANTIN.RESULTAT_BY_ID(resultatExistantId)}`, payload); // Route à définir dans Consts.js
        // Pour l'instant, on ne gère que la création
        console.warn("Mode mise à jour des résultats non implémenté, création d'un nouveau résultat.");
        response = await axios.post(wServer.CREATE.LABORANTIN.RESULTATS(prescriptionId), payload);
      } else {
        response = await axios.post(wServer.CREATE.LABORANTIN.RESULTATS(prescriptionId), payload);
      }
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('labPrescriptions'); // Rafraîchir la table des prescriptions
        queryClient.invalidateQueries(['resultatExistant', data.resultat?.prescriptionExamenId]);
        alert("Résultats enregistrés avec succès !");
      },
      onError: (error) => {
        console.error("Erreur enregistrement résultats:", error.response?.data || error.message);
        alert(`Erreur: ${error.response?.data?.message || "Échec de l'enregistrement des résultats."}`);
      },
    }
  );
};


// Hook pour valider les résultats (séparé car c'est une action distincte)
const useValiderResultats = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (prescriptionId) => {
            // Le backend attend laborantinId dans le body pour la validation
            const { data } = await axios.put(
                wServer.PUT.LABORANTIN.VALIDER_RESULTATS(prescriptionId),
                { laborantinId: "ID_LAB_CONNECTE_SI_BESOIN" } // REMPLACER L'ID
            );
            return data;
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('labPrescriptions');
                queryClient.invalidateQueries(['resultatExistant', data.resultat?.prescriptionExamenId]);
                alert("Résultats validés avec succès ! La prescription est marquée comme terminée.");
            },
            onError: (error) => {
                console.error("Erreur validation résultats:", error.response?.data || error.message);
                alert(`Erreur: ${error.response?.data?.message || "Échec de la validation."}`);
            }
        }
    );
};


const SaisirResultatsExamenModal = ({ open, onClose, prescriptionData, laborantinId }) => {
  const [resultatsSaisis, setResultatsSaisis] = useState({}); // { parametreId: valeur, ... }
  const [interpretation, setInterpretation] = useState('');
  // const [valeursAnormales, setValeursAnormales] = useState(''); // Peut être un JSON ou un texte simple
  const [commentaires, setCommentaires] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const {showNotification} = useNotification();

  const typeExamenId = prescriptionData?.typeExamenId || prescriptionData?.TypeExamen?.id;

  const { data: parametres = [], isLoading: isLoadingParametres, isError: isErrorParametres } = 
    useGetParametresExamen(typeExamenId, open);

  // Pour charger un résultat existant si on veut éditer (non implémenté entièrement)
  // const { data: resultatExistant, isLoading: isLoadingResultatExistant } = 
  //   useGetResultatExistant(prescriptionData?.id, open);

  // const isEditMode = !!resultatExistant; // Déterminer si on est en mode édition

  const { mutateAsync: saisirOuMajResultats, isLoading: isSavingResultats } = useSaisirOuMajResultatsExamen();
  const { mutateAsync: validerResultatsMutation, isLoading: isValidating } = useValiderResultats();


  useEffect(() => {
    if (open) {
        // if (isEditMode && resultatExistant) {
        //     setResultatsSaisis(resultatExistant.resultats || {}); // 'resultats' doit être un objet { parametreId: valeur }
        //     setInterpretation(resultatExistant.interpretation || '');
        //     setCommentaires(resultatExistant.commentaires || '');
        // } else {
            setResultatsSaisis({});
            setInterpretation('');
            setCommentaires('');
        // }
        setFormErrors({});
    }
  }, [open, prescriptionData/*, resultatExistant, isEditMode*/]);

  const handleResultatChange = (parametreId, value) => {
    setResultatsSaisis(prev => ({ ...prev, [parametreId]: value }));
    if (formErrors[parametreId]) {
        setFormErrors(prev => ({ ...prev, [parametreId]: undefined }));
    }
  };

  const validateSaisie = () => {
    const newErrors = {};
    let isValid = true;
    parametres.forEach(param => {
        if (param.obligatoire && (!resultatsSaisis[param.id] || String(resultatsSaisis[param.id]).trim() === '')) {
            newErrors[param.id] = `Le résultat pour "${param.nom}" est requis.`;
            isValid = false;
        }
        // TODO: Ajouter validation de type (numérique, texte, etc.) basée sur param.typeValeur
    });
    if (!interpretation.trim() && parametres.length > 0) { // Interprétation requise si des paramètres existent
        newErrors.interpretation = "L'interprétation globale est requise.";
        isValid = false;
    }
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSave = async (andValidate = false) => {
    console.log("HandleSave appelé avec:", { andValidate, prescriptionData, laborantinId });
    
    if (!validateSaisie()) {
        showNotification('Please, correct the errors in the form.', 'warning');
        return;
    }
    
    // Rendre laborantinId optionnel pour les tests
    if (!prescriptionData?.id) {
        showNotification('Missing Prescription Data', 'warning');
        return;
    }

    if (!laborantinId) {
        console.warn("laborantinId manquant, utilisation d'une valeur par défaut pour les tests");
    }

    const resultatPayload = {
        resultats: resultatsSaisis,
        interpretation: interpretation,
        commentaires: commentaires,
    };

    try {
        const resultatCreeOuMaj = await saisirOuMajResultats({ 
            prescriptionId: prescriptionData.id, 
            resultatData: resultatPayload,
        });

        if (andValidate && resultatCreeOuMaj?.resultat?.id) {
            await handleValidateResults(prescriptionData.id);
        } else if (andValidate) {
             console.warn("Impossible de valider immédiatement, ID du résultat manquant ou erreur de sauvegarde.");
        }
        
        if(!andValidate || !resultatCreeOuMaj?.resultat?.id) {
            onClose();
        }

    } catch (error) {
        console.error("Erreur dans handleSave:", error);
    }
  };

  const handleValidateResults = async (prescriptionIdToValidate) => {
    if(window.confirm("Êtes-vous sûr de vouloir valider ces résultats ? Cette action marquera l'examen comme terminé.")){
        try {
            await validerResultatsMutation(prescriptionIdToValidate);
            onClose(); // Fermer le modal principal après validation réussie
        } catch(e) {
            // Erreur gérée par la mutation
        }
    }
  };


  if (!open) return null;
  const isLoadingAnything = isLoadingParametres || isSavingResultats || isValidating /*|| isLoadingResultatExistant*/;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      // Ajouter des props pour forcer l'affichage
      disableEscapeKeyDown={false}
      disableBackdropClick={false}
    >
      <DialogTitle>
        <Typography variant="h5">
          Saisie des Résultats pour {prescriptionData?.TypeExamen?.nom || 'Examen'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Patient: {prescriptionData?.patientInfo?.prenom} {prescriptionData?.patientInfo?.nom} ({prescriptionData?.patientInfo?.matricule})
        </Typography>
      </DialogTitle>
      <form onSubmit={(e) => e.preventDefault()}> {/* Empêcher soumission HTML standard */}
        <DialogContent dividers>
            {isLoadingParametres && <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>}
            {isErrorParametres && <Alert severity="error">Erreur lors du chargement des paramètres de l'examen.</Alert>}
            
            {!isLoadingParametres && parametres.length === 0 && !isErrorParametres && (
                <Alert severity="info">Cet examen ne requiert pas la saisie de paramètres spécifiques. Vous pouvez directement saisir l'interprétation et les commentaires.</Alert>
            )}

            {!isLoadingParametres && parametres.length > 0 && (
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Valeurs Mesurées</Typography>
                    <Grid container spacing={2}>
                        {parametres.map(param => (
                            <Grid item xs={12} sm={6} key={param.id}>
                                <TextField
                                    label={`${param.nom}${param.unite ? ` (${param.unite})` : ''}${param.obligatoire ? ' *' : ''}`}
                                    fullWidth
                                    value={resultatsSaisis[param.id] || ''}
                                    onChange={(e) => handleResultatChange(param.id, e.target.value)}
                                    error={!!formErrors[param.id]}
                                    helperText={formErrors[param.id] || `Normal: ${param.valeurMinNormale || 'N/A'} - ${param.valeurMaxNormale || 'N/A'}`}
                                    variant="outlined"
                                    // TODO: Adapter le type de champ basé sur param.typeValeur (number, select pour +/- etc.)
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                 <Typography variant="h6" gutterBottom>Interprétation & Commentaires</Typography>
                 <TextField
                    label={`Interprétation globale${parametres.length > 0 ? ' *' : ''}`}
                    multiline
                    rows={3}
                    fullWidth
                    value={interpretation}
                    onChange={(e) => {
                        setInterpretation(e.target.value);
                        if (formErrors.interpretation) setFormErrors(prev => ({...prev, interpretation: undefined}));
                    }}
                    error={!!formErrors.interpretation}
                    helperText={formErrors.interpretation}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                {/* <TextField
                    label="Valeurs Anormales (si applicable)"
                    multiline
                    rows={2}
                    fullWidth
                    value={valeursAnormales}
                    onChange={(e) => setValeursAnormales(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                /> */}
                <TextField
                    label="Commentaires Additionnels"
                    multiline
                    rows={2}
                    fullWidth
                    value={commentaires}
                    onChange={(e) => setCommentaires(e.target.value)}
                    variant="outlined"
                />
            </Paper>

        </DialogContent>
        <DialogActions sx={{ p: '16px 24px', justifyContent: 'space-between' }}>
            <Button onClick={onClose} color="secondary" disabled={isLoadingAnything}>
                Annuler
            </Button>
            <Box>
                <Button onClick={() => handleSave(false)} variant="outlined" color="primary" disabled={isLoadingAnything} sx={{mr:1}}>
                    Enregistrer Brouillon
                </Button>
                <Button onClick={() => handleSave(true)} variant="contained" color="primary" disabled={isLoadingAnything}>
                    {isLoadingAnything ? <CircularProgress size={24} color="inherit" /> : "Enregistrer et Valider"}
                </Button>
            </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaisirResultatsExamenModal;
// --- END OF FILE SaisirResultatsExamenModal.js ---