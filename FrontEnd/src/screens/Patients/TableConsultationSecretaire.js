import {wServer } from "../../Data/Consts";
import axios from "axios";
import React, { useMemo, useState } from 'react';
import {MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable} from 'material-react-table';
import {Box, IconButton, Tooltip, DialogActions} from '@mui/material';
import { useQuery, QueryClient, QueryClientProvider, useQueryClient, useMutation } from 'react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification } from "../../reducers/NotificationContext";

const Table = () => {
  const [validationErrors, setValidationErrors] = useState({});

  const { data: fetchedUsers, isLoading: isLoadingUsers, isError: isLoadingUsersError } = useGetUsers();

  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleDeleteRow = async (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.getValue('firstName')} ${row.getValue('lastName')}?`)) {
      try {
        const matricule = row.getValue('matricule');
        await deleteUser(matricule);
        alert('Patient deleted successfully');
      } catch (error) {
        console.error('Delete operation failed:', error);
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'sex',
        header: 'Sex',
      },
      {
        accessorKey: 'service',
        header: 'Service',
      },
    ],
    [validationErrors],
  );

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers || [],
    enableRowActions: true,
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
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isDeletingUser,
    },
    renderEditRow: ({ row, table }) => (
      <>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {/* Champs d'édition */}
        </Box>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
  });

  return <MaterialReactTable table={table} />;
};

const useGetUsers = () => {
  const getUsers = async () => {
    try {
      const response = await axios.get(wServer.GET.PATIENT.ALL);
      return response.data.filter(patient => 
        patient.service && 
        patient.service !== '' && 
        patient.service !== 'Not Assigned'
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const { data: fetchedUsers = [], isLoading, isError } = useQuery({
    queryKey: ['users-with-service'],
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
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const {showNotification} = useNotification();

  return useMutation({
    mutationFn: async (matricule) => {
      try {
        console.log('Deleting patient with matricule:', matricule);
        const response = await axios.delete(`${wServer.DELETE.PATIENT.DELETE_BY_ID}/${matricule}`);
        console.log('Delete response:', response);

        // Invalider les requêtes pour forcer un rafraîchissement
        queryClient.invalidateQueries(['users-with-service']);
        queryClient.invalidateQueries(['users']);
        return response.data;
      } catch (error) {
        console.error('Delete request failed:', error);
        throw new Error(error?.response?.data?.message || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      showNotification('Opération réussi', 'success')
      queryClient.invalidateQueries(['users-with-service']);
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      showNotification('Une erreur est survenue lors de la suppresion du patient ! Veuillez reéssayer', 'error')
      throw error;
    },
  });
};

const queryClient = new QueryClient();

export const TableConsultationSecretaire = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  );
};

export default TableConsultationSecretaire;
