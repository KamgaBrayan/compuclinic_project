import { Services,wServer } from "../../Data/Consts";
import axios from "axios";
import React,{ useMemo, useState}  from 'react';
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip} from '@mui/material';
import { useQuery,QueryClient, QueryClientProvider, useMutation, useQueryClient, } from 'react-query';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from "../../reducers/NotificationContext";

const Table = () => {

  let dataService = Services.map(service => service.name);
  const [validationErrors, setValidationErrors] = useState({});
  const {showNotification} = useNotification();

  const validateUser = (patient) => {
    const errors = {};
    
    // Validation des champs obligatoires pour l'infirmier
    const requiredFields = ['temperature', 'weight', 'pressure', 'symptomes'];
    requiredFields.forEach((field) => {
      if (!patient[field]) {
        errors[field] = 'Ce champ est obligatoire';
      }
    });

    // Validation de la température
    if (patient.temperature) {
      const temp = parseFloat(patient.temperature);
      if (isNaN(temp) || temp < 27 || temp > 42) {
        errors.temperature = 'La température doit être entre 27 et 42 °C';
      }
    }

    // Validation du poids
    if (patient.weight) {
      const weight = parseFloat(patient.weight);
      if (isNaN(weight) || weight < 0 || weight > 300) {
        errors.weight = 'Le poids doit être entre 0 et 300 kg';
      }
    }

    // Validation de la pression artérielle
    if (patient.pressure) {
      const pressure = parseInt(patient.pressure);
      if (isNaN(pressure) || pressure < 60 || pressure > 250) {
        errors.pressure = 'La pression doit être un entier entre 60 et 250';
      }
    }

    return errors;
  };

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
        header: 'Temperature (°C)',
        disableEditing: true,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.temperature,
          helperText: validationErrors?.temperature,
          placeholder: 'Ex: 37.5',
          type: 'number',
          inputProps: {
            min: 27,
            max: 42,
            step: 0.1
          },
          onFocus: () => setValidationErrors({
            ...validationErrors,
            temperature: undefined,
          }),
        },
      },
      {
        accessorKey: 'weight',
        header: 'Weight (kg)',
        enableEditing: true,
        disableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.weight,
          helperText: validationErrors?.weight,
          placeholder: 'Ex: 75',
          type: 'number',
          inputProps: {
            min: 0,
            max: 300,
            step: 0.1
          },
          onFocus: () => setValidationErrors({
            ...validationErrors,
            weight: undefined,
          }),
        },
      },
      {
        accessorKey: 'pressure',
        header: 'Pressure (mmHg)',
        disableEditing: true,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.pressure,
          helperText: validationErrors?.pressure,
          placeholder: 'Ex: 120',
          onFocus: () => setValidationErrors({
            ...validationErrors,
            pressure: undefined,
          }),
        },
      },
      {
        accessorKey: 'symptomes',
        header: 'Symptômes',
        disableEditing: true,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.symptomes,
          helperText: validationErrors?.symptomes,
          placeholder: 'Décrivez les symptômes du patient',
          multiline: true,
          rows: 1,
          onFocus: () => setValidationErrors({
            ...validationErrors,
            symptomes: undefined,
          }),
        },
      },
      {
        accessorKey: 'antecedents',
        enableEditing: true,
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
        accessorKey: 'updatedAt',
        header: 'Update Date',
        enableEditing: false,
        muiEditTextFieldProps: {
          disabled: true,
          InputProps: {
            style: { backgroundColor: '#f5f5f5' }
          }
        }
      }
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isLoading: isLoadingUsers,
    isError: isLoadingUsersError,
  } = useGetUsers();
  console.log(fetchedUsers)
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

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
      showNotification("Veuillez corriger les erreurs de validation.", "warning");
      return;
    }

    try {
      await updateUser(values);
      table.setEditingRow(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers, //fetchedUsers,
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
        <DialogTitle variant="h3">Add Patient</DialogTitle>
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
        <DialogTitle variant="h3">Modifier les informations du patient</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ marginBottom: '1rem', color: 'text.secondary' }}>
            Les champs marqués d'un * sont obligatoires. Veuillez remplir tous les champs avec les unités appropriées :
            <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <li>Température en °C (entre 27 et 42)</li>
              <li>Poids en kg (entre 0 et 300)</li>
              <li>Pression artérielle en mmHg (ex: 120/80)</li>
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
        <Tooltip  title="Edit">
          <IconButton  onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <>
      </>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isLoadingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};


// Mettez à jour la fonction useCreateUser
function useCreateUser() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: async (newUserInfo) => {
      try {
        // Utilisation de Axios pour envoyer les données à l'API
        const response = await axios.post(wServer.CREATE.PATIENT, newUserInfo);

        // Assume que le backend renvoie l'objet de patient complet avec l'ID
        const createdPatient = response.data;
        console.log(createdPatient);

        return createdPatient; // Retourne les données complètes du patient créé
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
    onMutate: (newUserInfo) => {
      // Aucune mise à jour optimiste n'est nécessaire ici, car l'ID est géré par le backend
    },
    onSuccess: (createdPatient) => {
      // Mettez à jour les données dans le queryClient avec le nouveau patient créé
      showNotification("Paramètres sauvegardés avec succès !", 'success');
      queryClient.setQueryData(['users'], (prevUsers) => [...prevUsers, createdPatient]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), // Refetch des utilisateurs après la mutation, désactivé pour la démo
  });
}


function useGetUsers() {
  const getUsers = async () => {
    try {
      const response = await axios.get(wServer.GET.ALLCONSULTATIONS);
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredData = response.data.filter(item => {
        const consultationDate = new Date(item.updatedAt || item.createdAt);
        return (
          (item.temperature === null || 
          item.weight === null || 
          item.pressure === null || 
          item.symptomes === null || 
          item.antecedents === null) &&
          consultationDate >= twentyFourHoursAgo
        );
      });
      return filteredData;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const { data: fetchedUsers = [], isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });

  // Formater les dates pour chaque utilisateur
  const formattedUsers = fetchedUsers.map(user => ({
    ...user,
    birthDate: formatDate(user.birthDate)
  }));

  return { data: formattedUsers, isLoading, isError };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  const {showNotification} = useNotification();

  return useMutation({
    mutationFn: async (patientDataToSave) => { // Renommé 'patient' en 'patientDataToSave' pour plus de clarté
      try {
        // Vérification pour débogage afin de s'assurer que la nouvelle clé est correcte
        if (!wServer || !wServer.ACTION_POST.PUT || !wServer.ACTION_POST.PUT.INFIRMIERE || !wServer.ACTION_POST.PUT.INFIRMIERE.ADD_PATIENT_PARAMETERS) {
            const errorMsg = "La configuration de l'URL API (wServer.PUT.INFIRMIERE.ADD_PATIENT_PARAMETERS) est manquante ou incorrecte.";
            console.error(errorMsg, wServer.ACTION_POST.PUT?.INFIRMIERE); // Log la partie INFIRMIERE pour voir si ADD_PATIENT_PARAMETERS y est
            throw new Error(errorMsg);
        }

        console.log("Appel PUT vers (nouvelle clé):", wServer.ACTION_POST.PUT.INFIRMIERE.ADD_PATIENT_PARAMETERS);
        console.log("Avec les données:", patientDataToSave);

        const response = await axios.put(
          wServer.ACTION_POST.PUT.INFIRMIERE.ADD_PATIENT_PARAMETERS, // <<<< UTILISER CETTE CLÉ
          patientDataToSave
        );
        
        console.log('Réponse du serveur (dans mutationFn):', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du patient (dans mutationFn):', error.response?.data || error.message);
        throw error;
      }
    },
    onMutate: (updatedPatientInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => {
        if (!prevUsers) return [];
        return prevUsers.map((prevUser) => {
          if (prevUser.matricule === updatedPatientInfo.matricule) {
            return { ...prevUser, ...updatedPatientInfo };
          }
          return prevUser;
        });
      });
    },
    onSuccess: (data, variables) => {
        console.log("Mise à jour réussie (onSuccess). Réponse serveur:", data);
        showNotification("Mise à jour réussie !", 'success');
        // queryClient.invalidateQueries(['users']); // Pour forcer le rafraîchissement des données
    },
    onError: (error, variables) => {
        console.error("Erreur lors de la mise à jour (onError). Erreur:", error.response?.data || error.message);
        showNotification("Une erreur s'est produite lors de la mise à jour ! Veuillez reéssayer", 'error');
        // queryClient.invalidateQueries(['users']); // Pour annuler la modif optimiste et refléter l'état serveur
    }
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  // const queryClient = useQueryClient();
  const setDelete =  async (patient) => {
    return axios.put(wServer.ACTION_POST.DELETE.PATIENT.DELETE_BY_ID, patient)
      .then(response => {
        return response.data; // Si vous souhaitez retourner des données spécifiques
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error; // Propage l'erreur pour que les gestionnaires de promesses puissent la gérer
      });
  }
  //return {mutateAsync:setDelete,isPending: false}
  console.log('use delete user');
  return ""
  
}

const queryClient = new QueryClient();

export const TablePatientInfirmier = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>

);