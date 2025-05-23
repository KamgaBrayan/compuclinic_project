import { Services,wServer } from "../../Data/Consts";
import axios from "axios";
import React,{ useMemo, useState, useCallback}  from 'react';
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
  MenuItem,
  Tooltip,
} from '@mui/material';
import { useQuery,QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient, } from 'react-query';
import { fakeData, serviceStates } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Table = () => {

  let dataService = Services.map(service => service.name);
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();

  //call hooks
  const {
    data: fetchedUsers,
    isError: isLoadingUsersError,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleDeleteRow = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.getValue('firstName')} ${row.getValue('lastName')}?`)) {
      try {
        const matricule = row.getValue('matricule');
        console.log('Attempting to delete patient with matricule:', matricule);
        await deleteUser(matricule);
        // Si la suppression réussit, afficher un message de succès
        alert('Patient deleted successfully');
      } catch (error) {
        console.error('Delete operation failed:', error);
        // Afficher un message d'erreur plus descriptif
        alert(error.message || 'Failed to delete patient. Please try again.');
      }
    }
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
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
        },
      },
      {
        accessorKey: 'sex',
        header: 'Sex',
        editVariant: 'select',
        editSelectOptions: ['M', 'F'],
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: [
            <MenuItem key="M" value="M">M</MenuItem>,
            <MenuItem key="F" value="F">F</MenuItem>
          ],
        },
        muiCreateTextFieldProps: {
          select: true,
          children: [
            <MenuItem key="M" value="M">M</MenuItem>,
            <MenuItem key="F" value="F">F</MenuItem>
          ],
          required: true,
          error: !!validationErrors?.sex,
          helperText: validationErrors?.sex,
        },
      },
      { 
        accessorKey: 'birthDate',
        header: 'BirthDate: YYYY-MM-DD',
        muiTableBodyCellEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.birthDate,
          helperText: validationErrors?.birthDate,
        },
      },
      {
        accessorKey: 'cni',
        header: 'National ID',
        muiTableBodyCellEditTextFieldProps: {
          error: !!validationErrors?.cni,
          helperText: validationErrors?.cni,
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone Number',
        muiTableBodyCellEditTextFieldProps: {
          error: !!validationErrors?.phone,
          helperText: validationErrors?.phone,
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: {
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        muiTableBodyCellEditTextFieldProps: {
          error: !!validationErrors?.address,
          helperText: validationErrors?.address,
        },
      },
      {
        accessorKey: 'service',
        header: 'Service',
        editVariant: 'select',
        editSelectOptions: dataService,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: dataService.map((service) => (
            <MenuItem key={service} value={service}>{service}</MenuItem>
          )),
        },
        muiCreateTextFieldProps: {
          select: true,
          children: dataService.map((service) => (
            <MenuItem key={service} value={service}>{service}</MenuItem>
          )),
          required: true,
        },
        Cell: ({ cell }) => (
          <span>{cell.getValue() || 'Not Assigned'}</span>
        ),
      },
    ],
    [validationErrors]
  );

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    try {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      console.log('Creating user with values:', values);
      await createUser(values);
      table.setCreatingRow(null); // exit creating mode
    } catch (error) {
      console.error('Error in handleCreateUser:', error);
      alert(error.message || 'Failed to create patient. Please try again.');
    }
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

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers, //fetchedUsers,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row.matricule,
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
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Initier Consultation">
          <IconButton 
            color="primary" 
            onClick={() => {
              table.setEditingRow(row);
            }}
            sx={{
              backgroundColor: '#e8f0fe',
              '&:hover': {
                backgroundColor: '#d2e3fc',
              },
            }}
          >
            <LocalHospitalIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Add Patient
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: false,
    },
  });

  return <MaterialReactTable table={table} />;
};

// Mettre à jour la fonction useGetUsers
function useGetUsers() {
  const getUsers = async () => {
    try {
      const response = await axios.get(wServer.GET.PATIENT.ALL);
      console.log("Patient data example:", response.data[0]); // Pour voir la structure des données
      return response.data; // Retourner tous les patients sans filtrage
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

  // Parcourir chaque objet dans response.data et formater birthDate
  fetchedUsers.forEach(item => {
    if (item.birthDate) {
      item.birthDate = formatDate(item.birthDate);
    }
  });

  return { data: fetchedUsers, isLoading: isLoading, isError: isError };
}

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      try {
        console.log('Creating patient with values:', values);
        const response = await axios.post(wServer.CREATE.PATIENT, {
          ...values,
          service: values.service || null // Send null if no service selected
        });
        console.log('Create response:', response);
        return response.data;
      } catch (error) {
        console.error('Create request failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Error creating user:', error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Failed to create user');
    },
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patient) => {
      try {
        // Mettre à jour le patient
        const response = await axios.put(wServer.UPDATE.PATIENT.UPDATE_BY_ID, patient);
        
        // Si le service est mis à jour vers "Consultation", créer une nouvelle consultation
        if (patient.service === 'Consultation') {
          try {
            // Créer une nouvelle consultation pour le patient
            await axios.post(wServer.CREATE.CONSULTATION, {
              matricule: patient.matricule,
              firstName: patient.firstName,
              lastName: patient.lastName,
              birthDate: patient.birthDate,
              sex: patient.sex,
              service: patient.service
            });
            console.log('Consultation created for updated patient');
          } catch (error) {
            console.error('Error creating consultation:', error);
          }
        }
        
        return response.data;
      } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Rafraîchir les données des patients
      queryClient.invalidateQueries(['users']);
      // Rafraîchir les données des consultations pour la table de l'infirmier
      queryClient.invalidateQueries(['consultations']);
    }
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (matricule) => {
      try {
        console.log('Deleting patient with matricule:', matricule);
        // Utiliser l'endpoint de suppression existant
        const response = await axios.delete(`${wServer.DELETE.PATIENT.DELETE_BY_ID}/${matricule}`);
        console.log('Delete response:', response);

        // Si la suppression réussit, invalider les requêtes pour forcer un rafraîchissement
        queryClient.invalidateQueries(['users']);
        queryClient.invalidateQueries(['consultations']);
        queryClient.invalidateQueries(['patients']);

        return response.data;
      } catch (error) {
        console.error('Delete request failed:', error);
        throw new Error(error?.response?.data?.message || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      throw error;
    },
  });
}

const queryClient = new QueryClient();

export const TablePatientSecretaire = () => (
  //Put this with your other react-query providers near root of your app
  <QueryClientProvider client={queryClient}>
    <Table />
  </QueryClientProvider>

);

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

const isValidDate = (dateString) =>
    !!dateString.length &&
    dateString.match(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    );

const isValidSex = (sexValue) => {
  const validSexs = ['m', 'f', 'other'];
  return validSexs.includes(sexValue.toLowerCase());
};
const validateSex = (value) => ['M', 'F'].includes(value);

function validateUser(patient) {
  return {
    firstName: !validateRequired(patient.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(patient.lastName) ? 'Last Name is Required' : '',
    birthDate: !isValidDate(patient.birthDate) ? 'Incorrect Date Format   eg. 2024-11-08' : '',
    sex: !validateSex(patient.sex) ? 'Sex must be either M or F' : '',
    cni: !validateRequired(patient.cni) ? 'National ID is Required' : '',
    phone: !validateRequired(patient.phone) ? 'Phone Number is Required' : '',
    email: !validateEmail(patient.email) ? 'Invalid Email' : '',
    address: !validateRequired(patient.address) ? 'Address is Required' : '',
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
