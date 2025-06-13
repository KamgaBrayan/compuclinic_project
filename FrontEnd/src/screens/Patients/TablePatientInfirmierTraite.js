import { Services,wServer } from "../../Data/Consts";
import axios from "axios";
import React,{ useMemo, useState}  from 'react';
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import { Box, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip} from '@mui/material';
import { useQuery, QueryClient, QueryClientProvider, useMutation, useQueryClient, } from 'react-query';

import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from "../../reducers/NotificationContext";

const Table = () => {

  let dataService = Services.map(service => service.name);
  const [validationErrors, setValidationErrors] = useState({});
  const {showNotification} = useNotification();

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
        enableEditing: true,
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
        header: 'Weight (kg)',
        enableEditing: true,
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
        header: 'Pressure (mmHg)',
        disableEditing: true,
        enableEditing: true,
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
        enableEditing: true,
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
        disableEditing: false,
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
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
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
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
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
        <DialogTitle variant="h3">Edit Patient</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
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
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

// Mettez à jour la fonction useCreateUser
function useCreateUser() {
  const queryClient = useQueryClient();
  const {showNotification} = useNotification()

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
      showNotification('Opération réussi', 'success')
      queryClient.setQueryData(['users'], (prevUsers) => [...prevUsers, createdPatient]);
    },
    
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
          item.temperature !== null && 
          item.weight !== null && 
          item.pressure !== null && 
          item.symptomes !== null && 
          item.antecedents !== null &&
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
  return useMutation({
    mutationFn: async (patient) => {
      //send api update request here
      try {
        const response = await axios.put(wServer.UPDATE.PATIENT.UPDATE_PARAMETERS, patient)
        console.log('test patient traite');
        console.log(response.data);
        return response.data
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    //client side optimistic update
    onMutate: (newUser) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.matricule === newUser.matricule ? newUser : prevUser,
        ),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  // const queryClient = useQueryClient();
  const setDelete =  async (patient) => {
    return axios.put(wServer.DELETE.PATIENT.DELETE_BY_ID, patient)
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

export const TablePatientInfirmierTraite = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>

);

const validateRequired = (value) => !!value.length;

const isValidDate = (dateString) =>
    !!dateString.length &&
    dateString.match(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    );

const isValidSex = (sexValue) => {
  const validSexs = ['m', 'f', 'other'];
  return validSexs.includes(sexValue.toLowerCase());
};
function validateUser(patient) {
  return {
    firstName: !validateRequired(patient.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(patient.lastName) ? 'Last Name is Required' : '',
    birthDate: !isValidDate(patient.birthDate) ? 'Incorrect Date Format   eg. 2024-11-08' : '',
    sex: !isValidSex(patient.sex) ? 'Incorrect Gender , it is either M or F' : '',
  };
}