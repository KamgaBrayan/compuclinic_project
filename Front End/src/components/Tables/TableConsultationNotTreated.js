import { Services, wServer } from "../../Data/Consts";
import React,{ useMemo, useState}  from 'react';
import { useQuery, useMutation, useQueryClient, QueryClientProvider, QueryClient } from 'react-query';
import axios from 'axios';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';

import { fakeData, serviceStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import {DoneOutline} from '@mui/icons-material';

const Table = ( { treated }) => {

  let dataService = Services.map(service => service.name);
  const [validationErrors, setValidationErrors] = useState({});

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
        header: 'Diagnostic',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.diagnostique,
          helperText: validationErrors?.diagnostique,
          placeholder: 'Ex: Infection respiratoire aiguë avec toux persistante et fièvre',
          multiline: true,
          rows: 1,
          onFocus: () => setValidationErrors({
            ...validationErrors,
            diagnostique: undefined,
          }),
        },
      },
      {
        accessorKey: 'prescription',
        header: 'Prescription',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.prescription,
          helperText: validationErrors?.prescription,
          placeholder: 'Ex: Amoxicilline 500mg, 3x/jour pendant 7 jours\nParacétamol 1000mg si fièvre\nRepos pendant 3 jours',
          multiline: true,
          rows: 1,
          onFocus: () => setValidationErrors({
            ...validationErrors,
            prescription: undefined,
          }),
        },
      },
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
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteConsultation();
    const { mutateAsync: changeState, isPending: isChangingState } =
    useChangeStateConsultation();


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
      await updateUser(values);
      table.setEditingRow(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  //Change state action
  const openChangeStateConfirmModal = (row) => {
    if (window.confirm('Are you sure you to mark this consultation as finish?')) {
      changeState({
        matricule: row.original.matricule,
        statut: 'Terminer'
      });
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedConsultations, //fetchedConsultations,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Consultation Médicale - Patient {row.original.firstName} {row.original.lastName}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: 'text.primary', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Informations du patient :
            </div>
            <div style={{ color: 'text.secondary', marginLeft: '1rem' }}>
              <div>Âge : {row.original.birthDate ? (() => {
                const today = new Date();
                const birthDate = new Date(row.original.birthDate);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                return `${age} ans`;
              })() : 'Non spécifié'}</div>
              <div>Température : {row.original.temperature}°C</div>
              <div>Poids : {row.original.weight} kg</div>
              <div>Pression : {row.original.pressure} mmHg</div>
              <div>Symptômes : {row.original.symptomes}</div>
              <div>Antécédents : {row.original.antecedents || 'Aucun antécédent signalé'}</div>
            </div>
          </div>
          <div style={{ color: 'text.secondary' }}>
            Les champs marqués d'un * sont obligatoires. Veuillez fournir des informations détaillées :
            <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <li>Diagnostic : description claire et détaillée de l'état du patient (min. 10 caractères)</li>
              <li>Prescription : médicaments, posologie et durée du traitement (min. 10 caractères)</li>
            </ul>
          </div>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        { <Tooltip title="Marked finished">
          <IconButton color="success" onClick={() => openChangeStateConfirmModal(row)}>
            <DoneOutline />
          </IconButton>
        </Tooltip> }
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
    
      </>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser || isChangingState,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  // const queryClient = useQueryClient();
  return  ""
  // useMutation({
  //   mutationFn: async (user) => {
  //     //send api update request here
  //     await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
  //     return Promise.resolve();
  //   },
  //   //client side optimistic update
  //   onMutate: (newUserInfo) => {
  //     queryClient.setQueryData(['users'], (prevUsers) => [
  //       ...prevUsers,
  //       {
  //         ...newUserInfo,
  //         id: (Math.random() + 1).toString(36).substring(7),
  //       },
  //     ]);
  //   },
  //   // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  // });
}

//READ hook (get consultations from api)
// Fonction pour récupérer les consultations
/*async function useGetConsultations() {
  const response = await axios.get(wServer.GET.ALLCONSULTATIONS);
  //return response.data;
    //const response =  fakeData
    const filteredData = response.data.filter(item => item.diagnostique == null || item.prescription == null);
    console.log("filteredData")
    console.log(filteredData.birthDate)
    return { data : filteredData}
}*/

function useGetConsultations() {
  const getConsultations = async () => {
    try {
      const response = await axios.get(wServer.GET.ALLCONSULTATIONS);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredData = response.data.filter(item => {
        const consultationDate = new Date(item.updatedAt || item.createdAt);
        return (
          (item.diagnostique == null || item.prescription == null) && 
          item.statut !== 'Terminer' &&
          consultationDate >= twentyFourHoursAgo
        );
      });
      return filteredData;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  };

  const { data: fetchedConsultations = [], isLoading, isError } = useQuery({
    queryKey: ['consultations'],
    queryFn: getConsultations,
    refetchOnWindowFocus: false,
  });

  return { data: fetchedConsultations, isLoading:isLoading, isError:isError };
}


//UPDATE hook (put user in api)
function useUpdateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (consultation) => {
      //send api update request here
      try {
        const response = await axios.put(wServer.UPDATE.UPDATECONSULTATION, consultation);
        return response.data
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    //client side optimistic update
    onMutate: (newConsultationInfo) => {
      queryClient.setQueryData(['consultations'], (prevConsultations) =>
        prevConsultations?.map((prevConsultation) =>
          prevConsultation.matricule === newConsultationInfo.matricule ? newConsultationInfo : prevConsultation,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

function useChangeStateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ matricule, statut }) => {
      try {
        const response = await axios.put(wServer.UPDATE.UPDATESTATECONSULTATION, { matricule, statut });
        return response.data;
      } catch (error) {
        console.error('Error updating consultation state:', error);
        throw error;
      }
    },
    //client side optimistic update
    onMutate: (newConsultationInfo) => {
      queryClient.setQueryData(['consultations'], (prevConsultations) =>
          prevConsultations?.map((prevConsultation) =>
              prevConsultation.matricule === newConsultationInfo.matricule
                  ? { ...prevConsultation, statut: newConsultationInfo.statut }
                  : prevConsultation,
          ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matricule) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (matricule) => {
      queryClient.setQueryData(['consultations'], (prevConsultations) =>
        prevConsultations?.filter((consultation) => consultation.matricule !== matricule),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

 export const TableConsultationsNotTreated = () => (
  //Put this with your other react-query providers near root of your app

  <QueryClientProvider client = {queryClient}>
   <Table />
   </QueryClientProvider >

);


const validateRequired = (value) => !!value.length;

function validateUser(consultation) {
  const errors = {};
  
  // Validation des champs obligatoires pour le médecin
  const requiredFields = ['diagnostique', 'prescription'];
  requiredFields.forEach((field) => {
    if (!consultation[field]) {
      errors[field] = 'Ce champ est obligatoire';
    }
  });

  // Validation du diagnostic (minimum 10 caractères, vérification du contenu)
  if (consultation.diagnostique) {
    if (consultation.diagnostique.length < 10) {
      errors.diagnostique = 'Le diagnostic doit contenir au moins 10 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ0-9\s,.'-]+$/.test(consultation.diagnostique)) {
      errors.diagnostique = 'Le diagnostic contient des caractères non valides';
    }
  }

  // Validation de la prescription (minimum 10 caractères, vérification du contenu)
  if (consultation.prescription) {
    if (consultation.prescription.length < 10) {
      errors.prescription = 'La prescription doit contenir au moins 10 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ0-9\s,.'-]+$/.test(consultation.prescription)) {
      errors.prescription = 'La prescription contient des caractères non valides';
    }
  }

  return errors;
}
