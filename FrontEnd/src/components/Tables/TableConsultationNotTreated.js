import { Services, wServer } from "../../Data/Consts"; // Assurez-vous que wServer est bien importé
import React,{ useMemo, useState, useEffect }  from 'react'; // Ajout de useEffect
import { useQuery, useMutation, useQueryClient, QueryClientProvider, QueryClient } from 'react-query';
import axios from 'axios';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button, // Importer Button
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField, // Importer TextField pour les champs non-MRT si besoin
  Typography, // Importer Typography
  Divider, // Importer Divider
} from '@mui/material';

import { fakeData, serviceStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import {DoneOutline} from '@mui/icons-material';


import PrescribeMedicationModal from './PrescribeMedicationModal';
import PrescribeExamModal from "./PrescribeExamModel";

const Table = ( { treated }) => {

  let dataService = Services.map(service => service.name);
  const [validationErrors, setValidationErrors] = useState({});

  // --- États pour les nouveaux modals ---
  const [isPrescribeExamModalOpen, setIsPrescribeExamModalOpen] = useState(false);
  const [isPrescribeMedicationModalOpen, setIsPrescribeMedicationModalOpen] = useState(false);
  const [currentConsultationData, setCurrentConsultationData] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row, index) => index + 1,
        header: '#',
        size: 50,
        enableEditing: false,
      },
      {
        accessorKey: 'matricule',
        header: 'Matricule',
        disableEditing: true,
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'birthDate',
        header: 'Age',
        disableEditing: true,
        enableEditing: false,
        Cell: ({ cell }) => {
          const calculateAge = (birthDate) => {
            const today = new Date();
            const birthDateObj = new Date(birthDate);
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
              age--;
            }
            return age;
          };

          const birthDate = cell.getValue();
          if (!birthDate) return '';
          
          try {
            const age = calculateAge(birthDate);
            return `${age} ans`;
          } catch (error) {
            return 'Date invalide';
          }
        },
        muiEditTextFieldProps: {
          type: 'birthDate',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              birthDate: undefined,
            }),
        },
      },
      {
        accessorKey: 'sex',
        header: 'Sex',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.sex,
          helperText: validationErrors?.sex,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              sex: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'temperature',
        header: 'Temperature',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.temperature,
          helperText: validationErrors?.temperature,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              temperature: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'weight',
        header: 'Weight',
        enableEditing: false,
        disableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.weight,
          helperText: validationErrors?.weight,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              weight: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'pressure',
        header: 'Pressure',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.pressure,
          helperText: validationErrors?.pressure,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              pressure: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'symptomes',
        header: 'Symptomes',
        disableEditing: true,
        enableEditing: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.symptomes,
          helperText: validationErrors?.symptomes,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              symptomes: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'antecedents',
        enableEditing: false,
        header: 'Antecedents',
        disableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.antecedents,
          helperText: validationErrors?.antecedents,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              antecedents: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'diagnostique',
        header: 'Diagnostic du Médecin',
        muiEditTextFieldProps: ({row}) => ({ // Pass row pour accéder aux valeurs originales
          required: true,
          error: !!validationErrors?.diagnostique,
          helperText: validationErrors?.diagnostique,
          placeholder: 'Ex: Infection respiratoire aiguë...',
          multiline: true,
          rows: 3, // Augmenter la taille pour une meilleure visibilité
          defaultValue: row.original.diagnostique, // Pré-remplir avec la valeur existante
          onFocus: () => setValidationErrors({
            ...validationErrors,
            diagnostique: undefined,
          }),
        }),
      },
      // Le champ 'prescription' textuel original est retiré au profit des boutons/modals dédiés.
      // Si vous voulez le garder pour des notes générales, vous pouvez le laisser, mais il ne sera plus
      // le lieu principal pour les prescriptions structurées.
      // {
      //   accessorKey: 'prescription',
      //   header: 'Notes de Prescription Générales',
      //   muiEditTextFieldProps: {
      //     // ...props...
      //   },
      // },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedConsultations = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetConsultations();
  //call UPDATE hook
  
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateConsultation();
  //call DELETE hook
  
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteConsultation();
  
  const { mutateAsync: changeState, isPending: isChangingState } =
    useChangeStateConsultation();

  // Move this useEffect to the component level
  useEffect(() => {
    // This effect can be used for any side effects related to currentConsultationData
    if (currentConsultationData) {
      console.log('Current consultation data updated:', currentConsultationData);
    }
  }, [currentConsultationData]);

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    const errors = validateUser(values);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateUser({
        matricule: currentConsultationData.matricule, // Assurez-vous que matricule est dans currentConsultationData
        diagnostique: values.diagnostique,
        // prescription: values.prescription, // Si vous gardez le champ texte
      });
      table.setEditingRow(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du diagnostic:', error);
      // Gérer l'erreur (afficher un toast, etc.)
    }
  };

  //Change state action
  const openChangeStateConfirmModal = (row) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette consultation comme terminée ?')) {
      // Vérifier si un diagnostic a été posé. Optionnel: vérifier si une prescription (examen ou med) a été faite.
      if (!row.original.diagnostique && !(isPrescribeExamModalOpen || isPrescribeMedicationModalOpen) ) {
         // Ou si on veut permettre de terminer sans diagnostic/prescription
        // alert("Veuillez d'abord poser un diagnostic et/ou effectuer une prescription avant de terminer la consultation.");
        // return;
      }
      changeState({
        matricule: row.original.matricule,
        statut: 'Terminer'
      });
    }
  };

  const handleOpenPrescribeExamModal = (rowData) => {
    setCurrentConsultationData(rowData);
    setIsPrescribeExamModalOpen(true);
  };

  const handleOpenPrescribeMedicationModal = (rowData) => {
    setCurrentConsultationData(rowData);
    setIsPrescribeMedicationModalOpen(true);
  };


  const table = useMaterialReactTable({
    columns,
    data: fetchedConsultations,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id, // Assurez-vous que chaque consultation a un 'id' unique pour MRT
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? { color: 'error', children: 'Error loading data' }
      : undefined,
    muiTableContainerProps: { sx: { minHeight: '500px' } },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
      // Remove the useEffect from here - it was causing the error
      // Instead, set the current consultation data when the modal opens
      // This is already handled in the renderRowActions onClick handler
      
      const patientInfo = row.original; // Les données de la consultation incluent déjà les infos patient

      return (
        <>
          <DialogTitle variant="h5" sx={{ mb: 1 }}>Consultation Médicale - {patientInfo.firstName} {patientInfo.lastName}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom>Informations Patient & Paramètres (Infirmier)</Typography>
              <Typography variant="body2"><strong>Matricule:</strong> {patientInfo.matricule}</Typography>
              <Typography variant="body2"><strong>Âge:</strong> {patientInfo.birthDate ? (() => {
                  const today = new Date();
                  const birthDate = new Date(patientInfo.birthDate);
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }
                  return `${age} ans`;
                })() : 'N/A'}</Typography>
              <Typography variant="body2"><strong>Sexe:</strong> {patientInfo.sex}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2"><strong>Température:</strong> {patientInfo.temperature || 'N/A'} °C</Typography>
              <Typography variant="body2"><strong>Poids:</strong> {patientInfo.weight || 'N/A'} kg</Typography>
              <Typography variant="body2"><strong>Taille:</strong> {patientInfo.height || 'N/A'} cm</Typography>
              <Typography variant="body2"><strong>Tension:</strong> {patientInfo.pressure || 'N/A'} mmHg</Typography>
              <Typography variant="body2"><strong>Symptômes (selon infirmier):</strong> {patientInfo.symptomes || 'Aucun'}</Typography>
              <Typography variant="body2"><strong>Antécédents (selon infirmier):</strong> {patientInfo.antecedents || 'Aucun'}</Typography>
            </Box>

            <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: '4px' }}>
                <Typography variant="h6" gutterBottom>Diagnostic du Médecin</Typography>
                {/* Les champs éditables (diagnostique) seront rendus ici par internalEditComponents */}
                {/* Filtrez internalEditComponents pour ne montrer que 'diagnostique' si nécessaire */}
                {internalEditComponents.find(comp => comp.props.table.getColumn('diagnostique'))}

                 {/* Si vous gardez le champ prescription général */}
                 {/* {internalEditComponents.find(comp => comp.props.table.getColumn('prescription'))} */}
            </Box>

            <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom>Actions de Prescription</Typography>
              <Box sx={{ display: 'flex', gap: '1rem', mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenPrescribeMedicationModal(row.original)}
                >
                  Prescrire Médicaments
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleOpenPrescribeExamModal(row.original)}
                >
                  Prescrire Examens
                </Button>
              </Box>
            </Box>
            
            <Typography variant="caption" color="textSecondary">
                Les champs marqués d'un * sont obligatoires.
            </Typography>

          </DialogContent>
          <DialogActions>
            {/* MRT_EditActionButtons gère les boutons "Cancel" et "Save" */}
            {/* Le "Save" ici ne sauvegardera que le diagnostic (et la prescription textuelle si gardée) */}
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      );
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Consulter / Diagnostiquer">
          <IconButton onClick={() => {
            setCurrentConsultationData(row.original); // Important pour les modals de prescription
            table.setEditingRow(row);
          }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Marquer comme Terminé">
          <IconButton color="success" onClick={() => openChangeStateConfirmModal(row)} 
            disabled={!row.original.diagnostique} // Optionnel: désactiver si pas de diagnostic
          >
            <DoneOutline />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        {/* Pas de bouton "Create New User" ici, les consultations sont initiées par la secrétaire */}
      </>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isChangingState,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {/* --- Modals de prescription (seront créés dans des fichiers séparés) --- */}
      {currentConsultationData && ( // S'assurer que les données sont là avant de rendre
        <PrescribeExamModal
          open={isPrescribeExamModalOpen}
          onClose={() => setIsPrescribeExamModalOpen(false)}
          consultationData={currentConsultationData}
          // medecinId={"ID_DU_MEDECIN_CONNECTE"} // << REMPLACEZ CECI par la vraie valeur
        />
      )}
      {currentConsultationData && (
        <PrescribeMedicationModal
          open={isPrescribeMedicationModalOpen}
          onClose={() => setIsPrescribeMedicationModalOpen(false)}
          consultationData={currentConsultationData}
          medecinId={"ID_DU_MEDECIN_CONNECTE"} // << REMPLACEZ CECI par la vraie valeur
        />
      )}
    </>
  );
};

// ... (hooks useCreateUser, useGetConsultations, useUpdateConsultation, useChangeStateConsultation, useDeleteConsultation) ...
// Assurez-vous que useUpdateConsultation envoie bien les données attendues par le backend
// pour la mise à jour (principalement le diagnostic et le matricule/id de la consultation)

function useGetConsultations() {
  const getConsultations = async () => {
    try {
      const response = await axios.get(wServer.GET.ALLCONSULTATIONS); // Utilise la route définie dans Consts.js
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // Filtrer les consultations qui ne sont pas 'Terminer' et qui ont été créées/mises à jour récemment
      const filteredData = response.data.filter(item => {
        const consultationDate = new Date(item.updatedAt || item.createdAt); // updatedAt pour voir si l'infirmière a agi
        return (
          item.statut !== 'Terminer' && // Ne pas afficher les consultations déjà terminées
          consultationDate >= twentyFourHoursAgo && // Uniquement celles des dernières 24h
          item.temperature !== null // S'assurer que l'infirmière a déjà entré des paramètres
        );
      });
      return filteredData;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  };

  // Utilisation de useQuery pour récupérer les données
  const { data: fetchedConsultations = [], isLoading, isError, isFetching } = useQuery({
    queryKey: ['consultationsNonTraiteesMedecin'], // Clé de requête unique
    queryFn: getConsultations,
    refetchOnWindowFocus: false, // Évite les rafraîchissements inutiles
  });

  return { data: fetchedConsultations, isLoading, isError, isFetching };
}

function useUpdateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (consultation) => {
      // 'consultation' ici devrait contenir { matricule, diagnostique, prescription (si gardée) }
      try {
        // Utilise la route PUT.MEDECIN.UPDATE_CONSULTATION de Consts.js
        const response = await axios.put(wServer.PUT.MEDECIN.UPDATE_CONSULTATION_RESULT, consultation);
        return response.data;
      } catch (error) {
        console.error('Error updating consultation (diagnostic/prescription):', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalider et rafraîchir la liste des consultations non traitées
      queryClient.invalidateQueries('consultationsNonTraiteesMedecin');
      // Optionnel: Mettre à jour l'élément spécifique dans le cache si le backend retourne la consult mise à jour
      // queryClient.setQueryData(['consultationsNonTraiteesMedecin'], (oldData) =>
      //   oldData.map(item => item.matricule === variables.matricule ? { ...item, ...variables } : item)
      // );
    },
  });
}

function useChangeStateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ matricule, statut }) => {
      try {
        // Utilise la route PUT.MEDECIN.CHANGE_STATE de Consts.js
        const response = await axios.put(wServer.PUT.MEDECIN.CHANGE_CONSULTATION_STATE, { matricule, statut });
        return response.data;
      } catch (error) {
        console.error('Error updating consultation state:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Quand une consultation est marquée "Terminer", elle devrait disparaître de cette table
      queryClient.invalidateQueries('consultationsNonTraiteesMedecin');
      queryClient.invalidateQueries('consultationsTraiteesMedecin'); // Invalider aussi les traitées
    },
  });
}

// Le hook useCreateUser n'est probablement pas nécessaire ici car les consultations sont créées par la secrétaire.
// Le hook useDeleteConsultation n'est probablement pas nécessaire pour le médecin.
function useCreateUser() { return { mutateAsync: async () => {}, isPending: false }; } // Placeholder
function useDeleteConsultation() { return { mutateAsync: async () => {}, isPending: false }; } // Placeholder


const queryClient = new QueryClient();

 export const TableConsultationsNotTreated = () => (
  <QueryClientProvider client = {queryClient}>
   <Table />
   </QueryClientProvider >
);


const validateRequired = (value) => !!value && value.length > 0; // S'assurer que la valeur n'est pas juste des espaces

function validateUser(consultation) { // Renommer en validateConsultationEdit pour plus de clarté
  const errors = {};
  
  if (!validateRequired(consultation.diagnostique)) {
    errors.diagnostique = 'Le diagnostic est obligatoire.';
  } else if (consultation.diagnostique.length < 10) {
    errors.diagnostique = 'Le diagnostic doit contenir au moins 10 caractères.';
  }
  // Ne pas valider 'prescription' ici car elle est gérée par les modals dédiés
  return errors;
}