// --- START OF FILE PrescribeMedicationModal.js ---
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box, Typography, CircularProgress,
  Grid, Paper, List, ListItem, ListItemText, Divider, Autocomplete } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; 
import { debounce } from 'lodash'; 

// Hook pour la recherche de médicaments disponibles
const useSearchMedicaments = () => {
  // Pas de useQuery ici car la recherche est déclenchée par l'utilisateur
  // On fera un appel direct avec axios, ou on peut encapsuler dans une fonction
  const search = async (term) => {
    if (!term || term.length < 2) return []; // Ne pas chercher si le terme est trop court
    try {
      const { data } = await axios.get(wServer.GET.MEDECIN.MEDICAMENTS_DISPONIBLES, {
        params: { search: term }
      });
      return Array.isArray(data.medicaments) ? data.medicaments : [];
    } catch (error) {
      console.error("Erreur lors de la recherche de médicaments:", error);
      return [];
    }
  };
  return { search };
};

// Hook pour la mutation de création d'ordonnance
const useCreerOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (ordonnanceData) => {
      const { data } = await axios.post(wServer.CREATE.MEDECIN.CREER_ORDONNANCE, ordonnanceData);
      return data;
    },
    {
      onSuccess: (data) => {
        // queryClient.invalidateQueries(['ordonnancesPatient', data.ordonnance.matriculePatient]);
        console.log('Ordonnance créée avec succès:', data.ordonnance);
        // Afficher un toast de succès
      },
      /*
      onError: (error) => {
        console.error('Erreur lors de la création de l\'ordonnance:', error);
        // Afficher un toast d'erreur
      },
      */
    }
  );
};

const PrescribeMedicationModal = ({ open, onClose, consultationData, medecinId }) => {
  const [medicamentsPrescrits, setMedicamentsPrescrits] = useState([]);
  const [currentMedicament, setCurrentMedicament] = useState({
    medicamentId: null, // Stockera l'objet médicament sélectionné
    nomMedicament: '', // Pour affichage et recherche
    posologie: '',
    quantitePrescrite: '',
    dureeTraitement: '', // en jours
    instructions: ''
  });
  const [instructionsOrdonnance, setInstructionsOrdonnance] = useState('');
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { search: searchMedicamentsAPI } = useSearchMedicaments();
  const { mutate: creerOrdonnance, isLoading: isCreatingOrdonnance } = useCreerOrdonnance();
  const queryClient = useQueryClient();

  // Debounce la fonction de recherche
  const debouncedSearch = useCallback(debounce(async (term) => {
    if (term) {
      setIsSearching(true);
      const results = await searchMedicamentsAPI(term);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, 500), [searchMedicamentsAPI]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  
  useEffect(() => {
    if (open) {
      setMedicamentsPrescrits([]);
      setCurrentMedicament({ medicamentId: null, nomMedicament: '', posologie: '', quantitePrescrite: '', dureeTraitement: '', instructions: '' });
      setInstructionsOrdonnance('');
      setSearchTerm('');
      setSearchResults([]);
      setErrors({});
    }
  }, [open, consultationData]);

  const handleCurrentMedicamentChange = (field, value) => {
    setCurrentMedicament(prev => ({ ...prev, [field]: value }));
    if (errors.current && errors.current[field]) {
        setErrors(prev => ({ ...prev, current: { ...prev.current, [field]: undefined }}));
    }
  };
  
  const handleSelectMedicament = (event, value) => {
    if (value) {
      setCurrentMedicament(prev => ({
        ...prev,
        medicamentId: value, // value est l'objet médicament entier de l'Autocomplete
        nomMedicament: value.name // ou autre propriété pertinente pour l'affichage
      }));
      setSearchTerm(value.name); // Mettre à jour le terme de recherche pour l'affichage dans Autocomplete
      setSearchResults([]); // Vider les résultats après sélection
    } else {
      setCurrentMedicament(prev => ({ ...prev, medicamentId: null, nomMedicament: '' }));
      setSearchTerm('');
    }
  };

  const validateCurrentMedicament = () => {
    const newErrors = {};
    if (!currentMedicament.medicamentId) newErrors.medicamentId = 'Veuillez sélectionner un médicament.';
    if (!currentMedicament.posologie.trim()) newErrors.posologie = 'La posologie est requise.';
    if (!currentMedicament.quantitePrescrite || isNaN(parseInt(currentMedicament.quantitePrescrite)) || parseInt(currentMedicament.quantitePrescrite) <= 0) {
      newErrors.quantitePrescrite = 'Quantité invalide.';
    } else if (currentMedicament.medicamentId && parseInt(currentMedicament.quantitePrescrite) > currentMedicament.medicamentId.stock) {
      newErrors.quantitePrescrite = `Stock insuffisant (${currentMedicament.medicamentId.stock} disponible(s)).`;
    }
    if (currentMedicament.dureeTraitement && (isNaN(parseInt(currentMedicament.dureeTraitement)) || parseInt(currentMedicament.dureeTraitement) <= 0)) {
      newErrors.dureeTraitement = 'Durée invalide.';
    }
    setErrors({ ...errors, current: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMedicamentToOrdonnance = () => {
    if (!validateCurrentMedicament()) return;
    setMedicamentsPrescrits([...medicamentsPrescrits, { ...currentMedicament, idFront: Date.now() }]); // idFront pour la key de la liste
    setCurrentMedicament({ medicamentId: null, nomMedicament: '', posologie: '', quantitePrescrite: '', dureeTraitement: '', instructions: '' });
    setSearchTerm(''); // Réinitialiser le champ de recherche Autocomplete
    setErrors(prev => ({ ...prev, current: {}}));
  };

  const handleRemoveMedicamentFromOrdonnance = (idFrontToRemove) => {
    setMedicamentsPrescrits(medicamentsPrescrits.filter(med => med.idFront !== idFrontToRemove));
  };

  const handleSubmitOrdonnance = async () => {
    if (medicamentsPrescrits.length === 0) {
      setErrors({ global: 'Veuillez ajouter au moins un médicament à l\'ordonnance.' });
      alert('Veuillez ajouter au moins un médicament à l\'ordonnance.');
      return;
    }
    setErrors({});

    if (!consultationData || !consultationData.id || !consultationData.matricule) {
        console.error("Données de consultation invalides pour la prescription de médicaments.");
        alert("Erreur: Impossible de récupérer les informations de la consultation.");
        return;
    } 

    const ordonnancePayload = {
      matriculePatient: consultationData.matricule,
      medecinId: medecinId,
      consultationId: consultationData.id,
      medicaments: medicamentsPrescrits.map(med => ({
        medicamentId: med.medicamentId.id, // S'assurer que c'est bien l'ID du médicament
        posologie: med.posologie,
        quantite: parseInt(med.quantitePrescrite),
        dureeTraitement: med.dureeTraitement ? parseInt(med.dureeTraitement) : null,
        instructions: med.instructions
      })),
      instructions: instructionsOrdonnance
    };

    try {
      await creerOrdonnance(ordonnancePayload);
      alert("Ordonnance créée avec succès !");
      queryClient.invalidateQueries(['ordonnancesPatient', consultationData.matricule]);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de l'ordonnance :", error);
      alert("Une erreur s'est produite lors de la création de l'ordonnance.");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
         <Typography variant="h5" component="div">
          Prescrire des Médicaments pour {consultationData?.firstName} {consultationData?.lastName} ({consultationData?.matricule})
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Section Ajout Médicament */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Ajouter un Médicament</Typography>
              <Autocomplete
                freeSolo // Permet à l'utilisateur de taper librement, même si l'option n'est pas dans la liste
                options={searchResults}
                getOptionLabel={(option) => typeof option === 'string' ? option : `${option.name} (${option.dosageForm}) - Stock: ${option.stock}`}
                inputValue={searchTerm}
                onInputChange={(event, newInputValue) => {
                  setSearchTerm(newInputValue);
                }}
                onChange={handleSelectMedicament}
                loading={isSearching}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rechercher un médicament (nom, générique)"
                    variant="outlined"
                    error={!!errors.current?.medicamentId}
                    helperText={errors.current?.medicamentId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name} ({option.dosageForm || 'N/A'}) - Stock: {option.stock} - {option.unitPrice} XOF
                    </li>
                  )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ mb: 2 }}
              />
              
              {currentMedicament.medicamentId && (
                <Box sx={{my:1, p:1, border: '1px dashed grey', borderRadius:1}}>
                    <Typography variant="subtitle2">Médicament sélectionné: {currentMedicament.nomMedicament}</Typography>
                    <Typography variant="caption">Stock disponible: {currentMedicament.medicamentId.stock}</Typography>
                </Box>
              )}

              <TextField
                label="Posologie *"
                fullWidth
                value={currentMedicament.posologie}
                onChange={(e) => handleCurrentMedicamentChange('posologie', e.target.value)}
                error={!!errors.current?.posologie}
                helperText={errors.current?.posologie}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Quantité Prescrite *"
                    type="number"
                    fullWidth
                    value={currentMedicament.quantitePrescrite}
                    onChange={(e) => handleCurrentMedicamentChange('quantitePrescrite', e.target.value)}
                    error={!!errors.current?.quantitePrescrite}
                    helperText={errors.current?.quantitePrescrite}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Durée Traitement (jours)"
                    type="number"
                    fullWidth
                    value={currentMedicament.dureeTraitement}
                    onChange={(e) => handleCurrentMedicamentChange('dureeTraitement', e.target.value)}
                    error={!!errors.current?.dureeTraitement}
                    helperText={errors.current?.dureeTraitement}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Instructions spécifiques"
                multiline
                rows={2}
                fullWidth
                value={currentMedicament.instructions}
                onChange={(e) => handleCurrentMedicamentChange('instructions', e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddMedicamentToOrdonnance}
                disabled={!currentMedicament.medicamentId || isSearching}
                fullWidth
              >
                Ajouter à l'Ordonnance
              </Button>
            </Paper>
          </Grid>

          {/* Section Ordonnance en cours */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, minHeight: '400px' }}>
              <Typography variant="h6" gutterBottom>Ordonnance en cours</Typography>
              {medicamentsPrescrits.length === 0 ? (
                <Typography color="textSecondary">Aucun médicament ajouté pour le moment.</Typography>
              ) : (
                <List dense>
                  {medicamentsPrescrits.map((med, index) => (
                    <React.Fragment key={med.idFront}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMedicamentFromOrdonnance(med.idFront)}>
                            <DeleteIcon color="error"/>
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${index + 1}. ${med.nomMedicament} (x${med.quantitePrescrite})`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="textPrimary">
                                Posologie: {med.posologie}
                              </Typography>
                              {med.dureeTraitement && ` - Durée: ${med.dureeTraitement} jour(s)`}
                              {med.instructions && <><br/>Instructions: {med.instructions}</>}
                            </>
                          }
                        />
                      </ListItem>
                      {index < medicamentsPrescrits.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              <TextField
                label="Instructions générales pour l'ordonnance"
                multiline
                rows={3}
                fullWidth
                value={instructionsOrdonnance}
                onChange={(e) => setInstructionsOrdonnance(e.target.value)}
                sx={{ mt: 3 }}
              />
            </Paper>
             {errors.global && <Typography color="error" sx={{mt:1}}>{errors.global}</Typography>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleSubmitOrdonnance}
          variant="contained"
          color="primary"
          disabled={isCreatingOrdonnance || medicamentsPrescrits.length === 0}
        >
          {isCreatingOrdonnance ? <CircularProgress size={24} color="inherit" /> : "Valider l'Ordonnance"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescribeMedicationModal;