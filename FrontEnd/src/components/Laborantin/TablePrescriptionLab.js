// --- START OF FILE TablePrescriptionsLab.js ---
import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip, Typography, Chip, CircularProgress, Paper } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // Commencer
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Valider
import EditNoteIcon from '@mui/icons-material/EditNote'; // Saisir/Modifier Résultats
import VisibilityIcon from '@mui/icons-material/Visibility'; // Voir détails

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; // Ajustez le chemin

// Importer le futur modal de saisie des résultats
import SaisirResultatsExamenModal from './SaisirResultatsExamenModal';

// Hook pour récupérer les prescriptions en attente/en cours
const useGetPrescriptionsLab = (statutFiltre = ['paye', 'en_cours']) => { // Par défaut: payé ou en cours
    return useQuery(['labPrescriptions', statutFiltre], async () => {
        // L'API backend devrait permettre de filtrer par plusieurs statuts
        // Exemple: /api/laborantin/prescriptions?statut=paye&statut=en_cours
        // Pour l'instant, on suppose que l'API retourne tout et on filtre côté client,
        // ou que l'API prend un seul statut. Idéalement, l'API gère plusieurs statuts.
        
        // Si l'API ne prend qu'un statut, il faudra faire plusieurs appels ou ajuster l'API.
        // Pour cet exemple, on va imaginer que l'API peut prendre un tableau de statuts
        // ou qu'on fait un appel générique et filtre ensuite (moins optimal).
        const params = new URLSearchParams();
        statutFiltre.forEach(s => params.append('statut', s));
        
        const { data } = await axios.get(`${wServer.GET.LABORANTIN.PRESCRIPTIONS_EN_ATTENTE}?${params.toString()}`);
        // La réponse devrait être un tableau de prescriptions enrichies
        // { prescriptions: [{id, patientInfo, TypeExamen: {nom, ...}, medecinInfo, urgence, statut, datePrescription}, ...] }
        return Array.isArray(data.prescriptions) ? data.prescriptions : [];
    }, {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000, // Cache pour 1 minute
      refetchInterval: 2 * 60 * 1000, // Rafraîchir toutes les 2 minutes
    });
};

// Hooks pour les actions sur les prescriptions
const useUpdatePrescriptionStatut = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ prescriptionId, action }) => {
            // action pourrait être 'commencer' ou 'valider'
            let url;
            if (action === 'commencer') {
                url = wServer.PUT.LABORANTIN.COMMENCER_EXAMEN(prescriptionId);
            } else if (action === 'valider') {
                url = wServer.PUT.LABORANTIN.VALIDER_RESULTATS(prescriptionId);
            } else {
                throw new Error("Action non supportée");
            }
            // Le backend attend laborantinId dans le body pour certaines actions
            // Pour simplifier, on suppose qu'il est géré par la session backend ou n'est pas requis pour ces PUT
            const { data } = await axios.put(url, { /* laborantinId: ID_LAB_CONNECTE_SI_BESOIN */ });
            return data;
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries('labPrescriptions');
                // queryClient.invalidateQueries(['labPrescriptionDetail', data.prescription?.id]); // Si on a une vue détail
                alert(`Action "${data.message || 'réussie'}" !`); // Message à améliorer
            },
            onError: (error) => {
                console.error("Erreur action prescription:", error.response?.data || error.message);
                alert(`Erreur: ${error.response?.data?.message || 'Action échouée'}`);
            }
        }
    );
};


const TablePrescriptionsLab = () => {
    // Pour l'instant, on récupère les statuts 'paye' et 'en_cours'
    const { data: prescriptions = [], isLoading, isError, isFetching } = useGetPrescriptionsLab(['paye', 'en_cours']);
    const { mutateAsync: updateStatut, isLoading: isUpdatingStatut } = useUpdatePrescriptionStatut();

    const [isSaisieResultatModalOpen, setIsSaisieResultatModalOpen] = useState(false);
    const [selectedPrescriptionForResultats, setSelectedPrescriptionForResultats] = useState(null);

    const handleAction = async (prescriptionId, actionType) => {
        try {
            await updateStatut({ prescriptionId, action: actionType });
        } catch (e) {
            // Géré par onError de la mutation
        }
    };
    
    const openSaisieResultats = (prescription) => {
        setSelectedPrescriptionForResultats(prescription);
        setIsSaisieResultatModalOpen(true);
        console.log("Ouvrir modal saisie résultats pour:", prescription);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'datePrescription',
                header: 'Date Prescription',
                Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
                size: 150,
            },
            {
                accessorFn: (row) => `${row.patientInfo?.prenom || ''} ${row.patientInfo?.nom || ''} (${row.patientInfo?.matricule || 'N/A'})`,
                header: 'Patient',
                size: 250,
            },
            {
                accessorKey: 'TypeExamen.nom', // Accès via la relation incluse
                header: 'Examen Prescrit',
                size: 200,
            },
            {
                accessorKey: 'urgence',
                header: 'Urgence',
                Cell: ({ cell }) => {
                    const urgence = cell.getValue();
                    let color = 'default';
                    if (urgence === 'urgente') color = 'warning';
                    if (urgence === 'tres_urgente') color = 'error';
                    return <Chip label={urgence.replace('_', ' ')} size="small" color={color} />;
                },
                size: 120,
            },
            {
                accessorKey: 'statut',
                header: 'Statut',
                Cell: ({ cell }) => {
                    const statut = cell.getValue();
                    let color = 'default';
                    if (statut === 'paye') color = 'info';
                    if (statut === 'en_cours') color = 'secondary';
                    if (statut === 'termine') color = 'success';
                    return <Chip label={statut} size="small" color={color} />;
                },
                size: 120,
            },
            // On pourrait ajouter une colonne pour le médecin prescripteur si l'info est disponible
            // {
            //    accessorFn: (row) => `${row.medecinInfo?.prenom || ''} ${row.medecinInfo?.nom || ''}`,
            //    header: 'Médecin Prescripteur',
            // },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: prescriptions,
        getRowId: (row) => row.id, // id de la PrescriptionExamen
        enableEditing: false, // Pas d'édition directe dans la table, actions via boutons
        
        muiToolbarAlertBannerProps: isError
            ? { color: 'error', children: 'Erreur lors du chargement des prescriptions' }
            : undefined,
        state: {
            isLoading: isLoading,
            showProgressBars: isFetching || isUpdatingStatut,
        },
        renderRowActions: ({ row }) => {
            const prescription = row.original;
            return (
                <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                    {prescription.statut === 'paye' && (
                        <Tooltip title="Commencer l'examen">
                            <IconButton color="primary" onClick={() => handleAction(prescription.id, 'commencer')} disabled={isUpdatingStatut}>
                                <PlayCircleOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {prescription.statut === 'en_cours' && (
                        <Tooltip title="Saisir/Modifier les Résultats">
                            <IconButton color="secondary" onClick={() => openSaisieResultats(prescription)} disabled={isUpdatingStatut}>
                                <EditNoteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/* La validation se fera après la saisie des résultats, potentiellement depuis le modal de saisie ou une action séparée ici si un résultat partiel existe */}
                    {/* Exemple: si un résultat est saisi mais non validé */}
                    {/* {prescription.statut === 'en_cours' && prescription.ResultatExamen && !prescription.ResultatExamen.valide && (
                        <Tooltip title="Valider les Résultats">
                            <IconButton color="success" onClick={() => handleAction(prescription.id, 'valider')} disabled={isUpdatingStatut}>
                                <AssignmentTurnedInIcon />
                            </IconButton>
                        </Tooltip>
                    )} */}
                    <Tooltip title="Voir Détails Prescription">
                         <IconButton onClick={() => console.log("Voir détails:", prescription)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
        // Optionnel: Ajouter des filtres en haut du tableau (par statut, par urgence, etc.)
        // renderTopToolbarCustomActions: () => (
        //    <Typography>Filtres ici...</Typography>
        // ),
    });

    return (
        <Box>
            { <SaisirResultatsExamenModal
                open={isSaisieResultatModalOpen}
                onClose={() => setIsSaisieResultatModalOpen(false)}
                prescriptionData={selectedPrescriptionForResultats}
                // laborantinId={ID_LAB_CONNECTE}
            /> }
            <MaterialReactTable table={table} />
             {(isUpdatingStatut) && (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, mt:1, backgroundColor: 'action.hover' }}>
                    <CircularProgress size={20} sx={{mr: 1}} />
                    <Typography variant="body2">Mise à jour du statut...</Typography>
                </Box>
            )}
        </Box>
    );
};

export default TablePrescriptionsLab;
