// src/pages/Doctors/PreviewOrdonnanceGlobaleModal.js
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress, Divider, List, ListItem, Grid, ListItemText, Paper } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

import { wServerRoot } from "../../Data/Consts";
import { useReactToPrint } from 'react-to-print';
import { useNotification } from '../../reducers/NotificationContext';
import LogoHopital from '../../assets/images/logo-white.png'; // Ajoute un logo placeholder

// Hook pour fetcher les détails de l'ordonnance (médicaments)
const useGetOrdonnanceDetailsPourImpression = (consultationId, enabled) => {
    return useQuery(
        ['ordonnancePourImpression', consultationId],
        async () => {
            
            const { data } = await axios.get(`${wServerRoot}/medecin/consultations/${consultationId}/ordonnance-active`); // ENDPOINT FICTIF À ADAPTER/CRÉER
            return data.ordonnance; // Supposons que l'API retourne { ordonnance: { ... , PrescriptionMedicaments: [...] } }
        },
        {
            enabled: !!consultationId && enabled, // Activer seulement si consultationId est présent et le modal est ouvert
            staleTime: 0, // Toujours refetcher pour avoir la dernière version
            cacheTime: 0,
        }
    );
};

// Hook pour fetcher les prescriptions d'examens
const useGetExamensPrescritsPourImpression = (consultationId, enabled) => {
    return useQuery(
        ['examensPrescritsPourImpression', consultationId],
        async () => {
             // Il faudrait une route comme /api/medecin/consultations/{consultationId}/prescriptions-examens
            const { data } = await axios.get(`${wServerRoot}/medecin/consultations/${consultationId}/prescriptions-examens`); // ENDPOINT FICTIF À ADAPTER/CRÉER
            return data.prescriptionsExamens; // Supposons que l'API retourne { prescriptionsExamens: [...] }
        },
        {
            enabled: !!consultationId && enabled,
            staleTime: 0,
            cacheTime: 0,
        }
    );
};


const OrdonnanceAPImprimer = React.forwardRef(({ consultationData, ordonnanceMedicamenteuse, examensPrescrits, diagnostic }, ref) => {
    // consultationData contient les infos patient, et le diagnostic est passé séparément
    // ordonnanceMedicamenteuse est l'objet ordonnance avec ses PrescriptionMedicaments
    // examensPrescrits est le tableau des PrescriptionExamens

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    
    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }
        return age;
    };

    return (
        <Box ref={ref} sx={{ p: 4, fontFamily: 'Arial, sans-serif', color: '#000' }}>
            {/* En-tête de l'Hôpital */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '2px solid #000', pb: 2 }}>
                <Box>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>HÔPITAL COMPUCLINIC</Typography>
                    <Typography variant="body2">Service de Consultation Médicale</Typography>
                    <Typography variant="body2">BP 123, Yaoundé - Cameroun</Typography>
                    <Typography variant="body2">Tél : (+237) 123 456 789</Typography>
                </Box>
                <Box>
                    <img src={LogoHopital} alt="Logo Hôpital" style={{ height: '60px' }} />
                </Box>
            </Box>

            {/* Informations Patient et Consultation */}
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>ORDONNANCE GÉNÉRALE</Typography>
            
            <Grid container spacing={1} sx={{mb: 2}}>
                <Grid item xs={7}>
                    <Typography variant="body1"><strong>Patient :</strong> {consultationData?.firstName} {consultationData?.lastName}</Typography>
                    <Typography variant="body1"><strong>Matricule :</strong> {consultationData?.matricule}</Typography>
                </Grid>
                <Grid item xs={5} sx={{textAlign: 'right'}}>
                    <Typography variant="body1"><strong>Âge :</strong> {calculateAge(consultationData?.birthDate)} ans</Typography>
                    <Typography variant="body1"><strong>Sexe :</strong> {consultationData?.sex}</Typography>
                </Grid>
                 <Grid item xs={12}>
                     <Typography variant="body1"><strong>Date de consultation :</strong> {formatDate(consultationData?.updatedAt || consultationData?.createdAt || new Date())}</Typography>
                 </Grid>
            </Grid>
            
            {/* Diagnostic */}
            {diagnostic && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb:1 }}>Diagnostic Principal :</Typography>
                    <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{diagnostic}</Typography>
                </Box>
            )}
            <Divider sx={{ my: 2 }} />

            {/* Prescription de Médicaments */}
            {ordonnanceMedicamenteuse && ordonnanceMedicamenteuse.PrescriptionMedicaments && ordonnanceMedicamenteuse.PrescriptionMedicaments.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb:1 }}>Prescription Médicamenteuse :</Typography>
                    <List dense sx={{pl:2}}>
                        {ordonnanceMedicamenteuse.PrescriptionMedicaments.map((med, index) => (
                            <ListItem key={med.id || index} sx={{ display: 'list-item', pl:0, pb:1}}>
                                <Typography variant="body1">
                                    <strong>{med.Drug?.name || 'Médicament inconnu'}</strong> ( {med.Drug?.dosageForm} )
                                    <br />
                                    Posologie : {med.posologie}
                                    <br />
                                    Quantité : {med.quantitePrescrite} unités
                                    {med.dureeTraitement && ` - Durée : ${med.dureeTraitement} jour(s)`}
                                    {med.instructions && <><br/><em>Instruction : {med.instructions}</em></>}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                    {ordonnanceMedicamenteuse.instructions && (
                        <Typography variant="body2" sx={{mt:1, fontStyle:'italic'}}><strong>Instructions Générales (Médicaments) :</strong> {ordonnanceMedicamenteuse.instructions}</Typography>
                    )}
                </Box>
            )}
             {ordonnanceMedicamenteuse && ordonnanceMedicamenteuse.PrescriptionMedicaments && ordonnanceMedicamenteuse.PrescriptionMedicaments.length > 0 && <Divider sx={{ my: 2 }} />}


            {/* Prescription d'Examens */}
            {examensPrescrits && examensPrescrits.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb:1 }}>Examens Prescrits :</Typography>
                    <List dense sx={{pl:2}}>
                        {examensPrescrits.map((exam, index) => (
                            <ListItem key={exam.id || index} sx={{ display: 'list-item', pl:0, pb:1 }}>
                                 <Typography variant="body1">
                                    <strong>{exam.TypeExamen?.nom || 'Examen inconnu'}</strong>
                                    <br />
                                    Indication : {exam.indication}
                                    {exam.urgence !== 'normale' && ` - Urgence : ${exam.urgence.replace('_', ' ')}`}
                                 </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Pied de page de l'ordonnance */}
            <Box sx={{ mt: 5, pt: 2, borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="caption">
                    Cette ordonnance est valable jusqu'au : {ordonnanceMedicamenteuse?.dateExpiration ? formatDate(ordonnanceMedicamenteuse.dateExpiration) : 'N/A'} <br />
                    \softwareName{} - Généré le {formatDate(new Date())}
                </Typography>
                <Box sx={{textAlign: 'center'}}>
                     <Typography variant="body1" sx={{ fontWeight: 'bold', mb:3 }}>Signature du Médecin</Typography>
                     <Typography variant="body2">Dr. {consultationData?.medecinNom || 'Nom du Médecin (À récupérer)'}</Typography> 
                     {/* Tu auras besoin de récupérer le nom du médecin associé à la consultation */}
                </Box>
            </Box>
        </Box>
    );
});


const PreviewOrdonnanceGlobaleModal = ({ open, onClose, consultationData, diagnosticSauvegarde, onConfirmAndPrint, onModificationNeeded }) => {
    const componentRef = useRef();
    const { showNotification } = useNotification(); // Pour d'éventuelles notifications

    // Fetch des données nécessaires pour l'impression
    const { 
        data: ordonnanceMedicamenteuse, 
        isLoading: isLoadingOrdonnance, 
        isError: isErrorOrdonnance,
        error: errorOrdonnance
    } = useGetOrdonnanceDetailsPourImpression(consultationData?.id, open);

    const { 
        data: examensPrescrits, 
        isLoading: isLoadingExamens, 
        isError: isErrorExamens,
        error: errorExamens
    } = useGetExamensPrescritsPourImpression(consultationData?.id, open);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Ordonnance-${consultationData?.lastName}-${consultationData?.firstName}-${Date.now()}`,
        onAfterPrint: () => {
            console.log("Impression terminée ou annulée");
            // Tu pourrais appeler onConfirmAndPrint ici si tu veux que l'action se fasse APRES l'impression
        }
    });

    const handleConfirmAndPrintAndClose = () => {
        // 1. Déclencher l'impression
        handlePrint(); 
        // 2. Exécuter la logique de confirmation (qui pourrait marquer la consultation comme terminée)
        if (onConfirmAndPrint) {
            onConfirmAndPrint(); // Cette fonction sera responsable de la suite (ex: appel API pour terminer consultation)
        }
        // 3. Fermer le modal
        // onClose(); // onClose est généralement appelé après la sauvegarde/impression réussie par le composant parent
    };
    
    useEffect(() => {
        if(isErrorOrdonnance) console.error("Erreur fetch ordonnance:", errorOrdonnance?.response?.data || errorOrdonnance?.message);
        if(isErrorExamens) console.error("Erreur fetch examens:", errorExamens?.response?.data || errorExamens?.message);
    }, [isErrorOrdonnance, errorOrdonnance, isErrorExamens, errorExamens]);


    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography variant="h5">Prévisualisation de l'Ordonnance Générale</Typography>
            </DialogTitle>
            <DialogContent dividers>
                {(isLoadingOrdonnance || isLoadingExamens) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                        <CircularProgress />
                        <Typography sx={{ml:2}}>Chargement des données de prescription...</Typography>
                    </Box>
                )}
                {isErrorOrdonnance && <Typography color="error">Erreur lors du chargement des médicaments prescrits.</Typography>}
                {isErrorExamens && <Typography color="error">Erreur lors du chargement des examens prescrits.</Typography>}
                
                {!(isLoadingOrdonnance || isLoadingExamens) && (
                    <OrdonnanceAPImprimer 
                        ref={componentRef} 
                        consultationData={consultationData}
                        diagnostic={diagnosticSauvegarde} // Diagnostic déjà sauvegardé
                        ordonnanceMedicamenteuse={ordonnanceMedicamenteuse}
                        examensPrescrits={examensPrescrits}
                    />
                )}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onModificationNeeded || onClose} color="secondary">
                    Modifier Prescriptions
                </Button>
                <Button
                    onClick={handleConfirmAndPrintAndClose}
                    variant="contained"
                    color="primary"
                    disabled={isLoadingOrdonnance || isLoadingExamens || isErrorOrdonnance || isErrorExamens}
                >
                    Confirmer et Imprimer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PreviewOrdonnanceGlobaleModal;