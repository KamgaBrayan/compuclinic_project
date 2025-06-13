// --- START OF FILE PrescribeExamModal.js ---
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, IconButton, Box, Typography, CircularProgress, Grid, Paper, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; 
import { useNotification } from '../../reducers/NotificationContext';

// Hook pour récupérer les types d'examens disponibles
const useGetTypesExamensDisponibles = () => {
  return useQuery('typesExamensDisponibles', async () => {
    const { data } = await axios.get(wServer.GET.MEDECIN.TYPES_EXAMENS);
    // S'assurer que la réponse est bien un tableau, même si data.typesExamens est la structure attendue
    return Array.isArray(data.typesExamens) ? data.typesExamens : (Array.isArray(data) ? data : []);
  }, {
    staleTime: 5 * 60 * 1000, // Cache pour 5 minutes
  });
};

// Hook pour la mutation de prescription d'examen
const usePrescrireExamen = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation(
    async (prescriptionData) => {
      console.log("Appel API POST vers:", wServer.CREATE.MEDECIN.PRESCRIRE_EXAMEN, "avec data:", prescriptionData); 
      const { data } = await axios.post(wServer.CREATE.MEDECIN.PRESCRIRE_EXAMEN, prescriptionData);
      return data;
    },
    {
      onSuccess: (data) => { // 'data' est la réponse du serveur
        console.log('Réponse du serveur (onSuccess usePrescrireExamen):', data); // << AJOUTER CE LOG
        if (data && data.prescription) {
            console.log('Examen prescrit avec succès (ID Prescription):', data.prescription.id);
            console.log('Statut de la prescription créée:', data.prescription.statut); // Devrait être 'prescrit'
            showNotification('Examen prescrit avec succès !', 'success');
        } else {
            console.warn("La réponse du serveur après prescription ne contient pas l'objet 'prescription' attendu.")
        }
      },
      onError: (error) => {
        console.error('Erreur lors de la prescription de l\'examen:', error);
        // Afficher un toast d'erreur ici
      },
    }
  );
};

const PrescribeExamModal = ({ open, onClose, consultationData /*, medecinId */}) => {
  const [prescriptions, setPrescriptions] = useState([
    { typeExamenId: '', indication: '', urgence: 'normale', prix: 0 }
  ]);
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();

  const { data: typesExamens = [], isLoading: isLoadingTypesExamens, isError: isErrorTypesExamens } = useGetTypesExamensDisponibles();
  const { mutate: prescrireExamen, isLoading: isPrescribing } = usePrescrireExamen();
  const queryClient = useQueryClient();


  useEffect(() => {
    // Réinitialiser le formulaire lorsque le modal s'ouvre ou que les données de consultation changent
    if (open) {
      setPrescriptions([{ typeExamenId: '', indication: '', urgence: 'normale', prix: 0 }]);
      setErrors({});
    }
  }, [open, consultationData]);

  const handleAddPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { typeExamenId: '', indication: '', urgence: 'normale', prix: 0 }]);
  };

  const handleRemovePrescriptionRow = (index) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  const handleChange = (index, field, value) => {
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index][field] = value;

    if (field === 'typeExamenId') {
        const selectedExamen = typesExamens.find(examen => examen.id === value);
        newPrescriptions[index]['prix'] = selectedExamen ? selectedExamen.prix : 0;
    }

    setPrescriptions(newPrescriptions);
    // Effacer l'erreur pour ce champ spécifique
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    prescriptions.forEach((p, index) => {
      newErrors[index] = {};
      if (!p.typeExamenId) {
        newErrors[index].typeExamenId = 'Veuillez sélectionner un examen.';
        isValid = false;
      }
      if (!p.indication.trim()) {
        newErrors[index].indication = 'L\'indication est requise.';
        isValid = false;
      } else if (p.indication.trim().length < 5) {
        newErrors[index].indication = 'L\'indication doit comporter au moins 5 caractères.';
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification("Veuillez remplir le formulaire entièrement.", 'warning');
      return;
    }

    if (!consultationData || !consultationData.id || !consultationData.matricule) {
        console.error("Données de consultation invalides pour la prescription d'examen.");
        showNotification("Une erreur est survenue. Impossible de récupérer les informations de la consultation.", 'error');
        return;
    }

    
    try {
      for (const prescription of prescriptions) {
        const prescriptionPayload = {
          matriculePatient: consultationData.matricule,
          consultationId: consultationData.id,
          typeExamenId: prescription.typeExamenId,
          indication: prescription.indication,
          urgence: prescription.urgence,
        };
        console.log("Payload envoyé pour prescrireExamen:", prescriptionPayload);
        await prescrireExamen(prescriptionPayload); 
      }
      showNotification("Examens prescrits avec succès !", 'success');
      queryClient.invalidateQueries(['prescriptionsExamenPatient', consultationData.matricule]);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission des prescriptions d'examens (dans handleSubmit):", error);
      showNotification("Une erreur s'est produite lors de la prescription des examens. Veuillez reéssayer", 'error');
    }
  };

  if (!open) return null;

  const totalEstimatedPrice = prescriptions.reduce((sum, p) => sum + (p.prix || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Prescrire des Examens pour {consultationData?.firstName} {consultationData?.lastName} ({consultationData?.matricule})
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {isLoadingTypesExamens && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
        {isErrorTypesExamens && <Typography color="error">Erreur lors du chargement des types d'examens.</Typography>}
        
        {!isLoadingTypesExamens && !isErrorTypesExamens && typesExamens.length === 0 && (
            <Typography color="textSecondary" sx={{my: 2}}>Aucun type d'examen disponible ou configuré.</Typography>
        )}

        {!isLoadingTypesExamens && !isErrorTypesExamens && typesExamens.length > 0 && prescriptions.map((prescription, index) => (
          <Paper elevation={2} sx={{ p: 2, mb: 2, position: 'relative' }} key={index}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Examen #{index + 1}</Typography>
            {prescriptions.length > 1 && (
              <Tooltip title="Retirer cet examen">
                <IconButton
                  onClick={() => handleRemovePrescriptionRow(index)}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <FormControl fullWidth error={!!(errors[index] && errors[index].typeExamenId)}>
                  <InputLabel id={`type-examen-label-${index}`}>Type d'Examen *</InputLabel>
                  <Select
                    labelId={`type-examen-label-${index}`}
                    label="Type d'Examen *"
                    value={prescription.typeExamenId}
                    onChange={(e) => handleChange(index, 'typeExamenId', e.target.value)}
                  >
                    <MenuItem value=""><em>Sélectionner un examen</em></MenuItem>
                    {typesExamens.map((examen) => (
                      <MenuItem key={examen.id} value={examen.id}>
                        {examen.nom} ({examen.categorie}) - {examen.prix} XOF
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[index] && errors[index].typeExamenId && <Typography color="error" variant="caption">{errors[index].typeExamenId}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel id={`urgence-label-${index}`}>Urgence</InputLabel>
                  <Select
                    labelId={`urgence-label-${index}`}
                    label="Urgence"
                    value={prescription.urgence}
                    onChange={(e) => handleChange(index, 'urgence', e.target.value)}
                  >
                    <MenuItem value="normale">Normale</MenuItem>
                    <MenuItem value="urgente">Urgente</MenuItem>
                    <MenuItem value="tres_urgente">Très Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Indication / Motif de la prescription *"
                  multiline
                  rows={2}
                  value={prescription.indication}
                  onChange={(e) => handleChange(index, 'indication', e.target.value)}
                  error={!!(errors[index] && errors[index].indication)}
                  helperText={errors[index] && errors[index].indication}
                />
              </Grid>
              {prescription.prix > 0 && (
                 <Grid item xs={12}>
                    <Typography variant="body2" sx={{textAlign: 'right', fontWeight: 'bold'}}>
                        Prix estimé: {prescription.prix.toLocaleString()} XOF
                    </Typography>
                 </Grid>
              )}
            </Grid>
          </Paper>
        ))}

        {!isLoadingTypesExamens && typesExamens.length > 0 && (
             <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddPrescriptionRow}
                sx={{ mt: 1 }}
                variant="outlined"
             >
                Ajouter un autre examen
            </Button>
        )}

        {prescriptions.length > 0 && totalEstimatedPrice > 0 && (
            <Box sx={{mt: 2, p: 1, backgroundColor: 'grey.100', borderRadius: 1, textAlign: 'right'}}>
                <Typography variant="h6">
                    Total Estimé des Examens: {totalEstimatedPrice.toLocaleString()} XOF
                </Typography>
            </Box>
        )}

      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isPrescribing || isLoadingTypesExamens || prescriptions.some(p => !p.typeExamenId)}
        >
          {isPrescribing ? <CircularProgress size={24} color="inherit" /> : "Valider Prescriptions"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescribeExamModal;
