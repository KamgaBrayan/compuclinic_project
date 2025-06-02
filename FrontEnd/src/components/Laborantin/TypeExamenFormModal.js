// --- START OF FILE TypeExamenFormModal.js ---
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; // Ajustez le chemin

// Hook pour la création d'un type d'examen
const useCreateTypeExamen = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (examenData) => {
            const { data } = await axios.post(wServer.CREATE.LABORANTIN.TYPE_EXAMEN, examenData);
            return data;
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('labTypesExamens'); // Rafraîchir la liste
                // Afficher toast succès
                console.log("Type d'examen créé avec succès:", data.typeExamen);
                alert("Type d'examen créé avec succès !");
            },
            onError: (error) => {
                console.error("Erreur création type d'examen:", error.response?.data || error.message);
                alert(`Erreur: ${error.response?.data?.message || error.message}`);
            },
        }
    );
};

// Hook pour la mise à jour d'un type d'examen
const useUpdateTypeExamenModal = () => { // Renommé pour éviter conflit avec celui de la table
    const queryClient = useQueryClient();
    return useMutation(
        async (examenData) => {
            const { id, ...dataToUpdate } = examenData;
            const { data } = await axios.put(wServer.PUT.LABORANTIN.TYPE_EXAMEN(id), dataToUpdate);
            return data;
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('labTypesExamens'); // Rafraîchir la liste
                // Afficher toast succès
                console.log("Type d'examen mis à jour:", data.typeExamen);
                 alert("Type d'examen mis à jour avec succès !");
            },
            onError: (error) => {
                console.error("Erreur màj type d'examen:", error.response?.data || error.message);
                alert(`Erreur: ${error.response?.data?.message || error.message}`);
            },
        }
    );
};

const TypeExamenFormModal = ({ open, onClose, examenToEdit, laborantinId }) => {
    const [formData, setFormData] = useState({
        nom: '',
        code: '',
        description: '',
        prix: '',
        dureeEstimee: '30', // Default value
        necessitePrevision: '',
        categorie: 'autre', // Default value
        disponible: true, // Default
    });
    const [errors, setErrors] = useState({});

    const { mutateAsync: createTypeExamen, isLoading: isCreating } = useCreateTypeExamen();
    const { mutateAsync: updateTypeExamen, isLoading: isUpdating } = useUpdateTypeExamenModal();

    const isEditMode = Boolean(examenToEdit);

    useEffect(() => {
        if (isEditMode && examenToEdit) {
            setFormData({
                nom: examenToEdit.nom || '',
                code: examenToEdit.code || '',
                description: examenToEdit.description || '',
                prix: examenToEdit.prix || '',
                dureeEstimee: examenToEdit.dureeEstimee || '30',
                necessitePrevision: examenToEdit.necessitePrevision || '',
                categorie: examenToEdit.categorie || 'autre',
                disponible: examenToEdit.disponible !== undefined ? examenToEdit.disponible : true,
            });
        } else {
            // Reset pour le mode création ou si examenToEdit est null
            setFormData({
                nom: '', code: '', description: '', prix: '',
                dureeEstimee: '30', necessitePrevision: '',
                categorie: 'autre', disponible: true,
            });
        }
        setErrors({}); // Toujours réinitialiser les erreurs
    }, [examenToEdit, open, isEditMode]);


    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!formData.code.trim()) newErrors.code = "Le code est requis.";
        else if (formData.code.trim().length < 2) newErrors.code = "Le code doit avoir au moins 2 caractères.";
        if (!formData.prix || isNaN(parseFloat(formData.prix)) || parseFloat(formData.prix) < 0) {
            newErrors.prix = "Le prix doit être un nombre positif.";
        }
        if (!formData.dureeEstimee || isNaN(parseInt(formData.dureeEstimee)) || parseInt(formData.dureeEstimee) <= 0) {
            newErrors.dureeEstimee = "La durée estimée doit être un entier positif.";
        }
        if (!formData.categorie) newErrors.categorie = "La catégorie est requise.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            alert("Veuillez corriger les erreurs du formulaire.");
            return;
        }

        const submissionData = {
            ...formData,
            prix: parseFloat(formData.prix),
            dureeEstimee: parseInt(formData.dureeEstimee),
            laborantinId: laborantinId // Assurez-vous que laborantinId est fourni
        };
        
        if (!laborantinId && !isEditMode) { // En mode création, laborantinId est nécessaire
            alert("Erreur : ID du laborantin responsable manquant pour la création.");
            console.error("Erreur : ID du laborantin responsable manquant pour la création.");
            return;
        }


        try {
            if (isEditMode) {
                await updateTypeExamen({ id: examenToEdit.id, ...submissionData });
            } else {
                await createTypeExamen(submissionData);
            }
            onClose(); // Fermer le modal après succès
        } catch (error) {
            // Les erreurs sont gérées dans onError des mutations
            // On pourrait vouloir afficher un message plus générique ici si les mutations ne le font pas
        }
    };

    const categoriesExamen = [
        'hematologie', 'biochimie', 'microbiologie', 'parasitologie', 
        'immunologie', 'radiologie', 'echographie', 'autre'
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h5">
                    {isEditMode ? "Modifier le Type d'Examen" : "Ajouter un Nouveau Type d'Examen"}
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="nom"
                                label="Nom de l'examen *"
                                value={formData.nom}
                                onChange={handleChange}
                                error={!!errors.nom}
                                helperText={errors.nom}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="code"
                                label="Code Examen *"
                                value={formData.code}
                                onChange={handleChange}
                                error={!!errors.code}
                                helperText={errors.code}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="prix"
                                label="Prix (XOF) *"
                                type="number"
                                value={formData.prix}
                                onChange={handleChange}
                                error={!!errors.prix}
                                helperText={errors.prix}
                                fullWidth
                                margin="dense"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                             <FormControl fullWidth margin="dense" error={!!errors.categorie}>
                                <InputLabel id="categorie-label">Catégorie *</InputLabel>
                                <Select
                                    labelId="categorie-label"
                                    name="categorie"
                                    value={formData.categorie}
                                    label="Catégorie *"
                                    onChange={handleChange}
                                >
                                    {categoriesExamen.map(cat => (
                                        <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
                                    ))}
                                </Select>
                                {errors.categorie && <FormHelperText>{errors.categorie}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dureeEstimee"
                                label="Durée Estimée (minutes) *"
                                type="number"
                                value={formData.dureeEstimee}
                                onChange={handleChange}
                                error={!!errors.dureeEstimee}
                                helperText={errors.dureeEstimee}
                                fullWidth
                                margin="dense"
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            {/* Champ caché ou pré-rempli pour laborantinId si nécessaire en mode création */}
                            {/* Actuellement, on s'attend à ce qu'il soit passé en prop */}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="necessitePrevision"
                                label="Prévisions (ex: à jeun)"
                                value={formData.necessitePrevision}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={onClose} color="secondary">
                        Annuler
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isCreating || isUpdating}>
                        {(isCreating || isUpdating) ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Enregistrer Modifications" : "Créer Examen")}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TypeExamenFormModal;
// --- END OF FILE TypeExamenFormModal.js ---