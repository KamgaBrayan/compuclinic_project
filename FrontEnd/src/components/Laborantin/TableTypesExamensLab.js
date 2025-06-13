// --- START OF FILE TableTypesExamensLab.js ---
import React, { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip, Typography, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings'; // Pour gérer les paramètres
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TypeExamenFormModal from './TypeExamenFormModal';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { wServer } from '../../Data/Consts'; // Ajustez le chemin

// Hook pour récupérer les types d'examens
const useGetTypesExamens = () => {
    return useQuery('labTypesExamens', async () => {
        const { data } = await axios.get(wServer.GET.LABORANTIN.TYPES_EXAMENS);
        // La réponse backend est { typesExamens: [...] }
        return Array.isArray(data.typesExamens) ? data.typesExamens : [];
    }, {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Cache pour 5 minutes
    });
};

// Hook pour mettre à jour un type d'examen (pour la checkbox "Disponible")
const useUpdateTypeExamen = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (examenData) => {
            // examenData devrait contenir l'id et le champ à mettre à jour, ex: { id: 'uuid', disponible: true }
            const { id, ...dataToUpdate } = examenData;
            const { data } = await axios.put(wServer.ACTION_POST.PUT.LABORANTIN.TYPE_EXAMEN(id), dataToUpdate);
            return data;
        },
        {
            onSuccess: (updatedExamen) => {
                queryClient.setQueryData('labTypesExamens', (oldData) =>
                    oldData.map((examen) =>
                        examen.id === updatedExamen.typeExamen.id ? updatedExamen.typeExamen : examen
                    )
                );
                // Afficher un toast de succès
                console.log("Statut de disponibilité mis à jour !");
            },
            onError: (error) => {
                console.error("Erreur lors de la mise à jour du statut de disponibilité:", error);
                // Afficher un toast d'erreur
                alert("Erreur lors de la mise à jour.");
            },
        }
    );
};

// Hook pour supprimer un type d'examen
const useDeleteTypeExamen = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (examenId) => {
            await axios.delete(wServer.ACTION_POST.DELETE.LABORANTIN.TYPE_EXAMEN(examenId));
            return examenId; // Retourner l'ID pour la mise à jour optimiste ou onSuccess
        },
        {
            onSuccess: (deletedExamenId) => {
                queryClient.setQueryData('labTypesExamens', (oldData) =>
                    oldData.filter((examen) => examen.id !== deletedExamenId)
                );
                console.log("Type d'examen supprimé avec succès !");
                alert("Type d'examen supprimé avec succès !");
            },
            onError: (error) => {
                console.error("Erreur suppression type d'examen:", error.response?.data || error.message);
                alert(`Erreur: ${error.response?.data?.message || "Impossible de supprimer. Vérifiez s'il y a des prescriptions liées."}`);
            },
        }
    );
};

const TableTypesExamensLab = () => {
    const { data: typesExamens = [], isLoading, isError, isFetching } = useGetTypesExamens();
    const { mutateAsync: updateTypeExamenDisponible, isLoading: isUpdatingDisponible } = useUpdateTypeExamen(); // Renommé pour clarté
    const { mutateAsync: deleteTypeExamen, isLoading: isDeleting } = useDeleteTypeExamen();


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [isParametresModalOpen, setIsParametresModalOpen] = useState(false); // Pour plus tard
    const [selectedExamenForModal, setSelectedExamenForModal] = useState(null);

    // Simuler l'ID du laborantin connecté (à remplacer par une vraie logique d'auth)
    // const LABORANTIN_ID_CONNECTE = 1; // Exemple, DOIT ÊTRE DYNAMIQUE

    const handleToggleDisponible = async (row) => {
        // ... (comme avant)
        await updateTypeExamenDisponible({ id: row.original.id, disponible: !row.original.disponible });
    };
    
    const handleDelete = async (row) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'examen "${row.original.nom}" ? Cette action est irréversible.`)) {
            try {
                await deleteTypeExamen(row.original.id);
            } catch (e) {
                // Erreur gérée dans onError de la mutation
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'nom',
                header: 'Nom de l\'Examen',
                size: 250,
            },
            {
                accessorKey: 'code',
                header: 'Code',
                size: 100,
            },
            {
                accessorKey: 'categorie',
                header: 'Catégorie',
                size: 150,
            },
            {
                accessorKey: 'prix',
                header: 'Prix (XOF)',
                size: 120,
                Cell: ({ cell }) => cell.getValue()?.toLocaleString() || 'N/A',
            },
            {
                accessorKey: 'disponible',
                header: 'Disponible',
                size: 120,
                Cell: ({ row }) => (
                  <Tooltip title={row.original.disponible ? "Marquer comme non disponible" : "Marquer comme disponible"}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!row.original.disponible} // Assurer que c'est un booléen
                                onChange={() => handleToggleDisponible(row)}
                                color="primary"
                                disabled={isUpdatingDisponible}
                            />
                        }
                        label={row.original.disponible ? "Oui" : "Non"}
                    />
                  </Tooltip>
                ),
            },
             {
                accessorKey: 'dureeEstimee',
                header: 'Durée (min)',
                size: 100,
                Cell: ({ cell }) => cell.getValue() || 'N/A',
             },
        ],
        [isUpdatingDisponible]
    );

    const table = useMaterialReactTable({
        columns,
        data: typesExamens,
        getRowId: (row) => row.id,
        enableEditing: false, // L'édition se fait via les actions et modals dédiés
        
        muiToolbarAlertBannerProps: isError
            ? { color: 'error', children: 'Erreur lors du chargement des données' }
            : undefined,
        state: {
            isLoading: isLoading,
            showProgressBars: isFetching || isUpdatingDisponible || isDeleting,
        },
        renderTopToolbarCustomActions: () => (
            <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                    setSelectedExamenForModal(null); // Important pour le mode création
                    setIsCreateModalOpen(true);
                }}
            >
                Ajouter un Type d'Examen
            </Button>
        ),
        renderRowActions: ({ row }) => (
            <Box sx={{ display: 'flex', gap: '0.2rem' }}> {/* Réduit le gap */}
                <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => {
                        setSelectedExamenForModal(row.original);
                        setIsEditModalOpen(true);
                    }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Gérer Paramètres (Bientôt)">
                    <IconButton size="small" disabled onClick={() => { /* setIsParametresModalOpen(true); */ }}>
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                    <IconButton size="small" color="error" onClick={() => handleDelete(row)} disabled={isDeleting}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    });

    return (
        <Box>
            <TypeExamenFormModal 
                open={isCreateModalOpen || isEditModalOpen} 
                examenToEdit={isEditModalOpen ? selectedExamenForModal : null} 
                onClose={() => { 
                    setIsCreateModalOpen(false); 
                    setIsEditModalOpen(false);
                    setSelectedExamenForModal(null);
                }}
                // laborantinId={LABORANTIN_ID_CONNECTE} // << PASSER LE VRAI ID ICI
            />
            {/* <ParametresExamenModal open={isParametresModalOpen} typeExamen={selectedExamenForModal} onClose={() => setIsParametresModalOpen(false)} /> */}
            
            <MaterialReactTable table={table} />
            
            {(isUpdatingDisponible || isDeleting) && (
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, mt:1, backgroundColor: 'action.hover' }}>
                    <CircularProgress size={20} sx={{mr: 1}} />
                    <Typography variant="body2">
                        {isUpdatingDisponible ? "Mise à jour de la disponibilité..." : (isDeleting ? "Suppression en cours..." : "")}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TableTypesExamensLab;