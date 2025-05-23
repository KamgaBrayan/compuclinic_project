import React, { useMemo , useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { citiesList, data, usStateList } from './makeData';

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const Example = () => {
  const columns = useMemo(
    () => [

      {
        accessorKey: 'name',
        header: 'Nom',
        filterVariant: 'text', // default
        size: 200,
      },
      {
        accessorKey: 'salary',
        header: 'Prix',
        Cell: ({ cell }) =>
          cell.getValue().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        muiFilterSliderProps: {
          marks: true,
          max: 200_000, //custom max (as opposed to faceted max)
          min: 30_000, //custom min (as opposed to faceted min)
          step: 10_000,
          valueLabelFormat: (value) =>
            value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
        },
      },
      {
        accessorKey: 'age',
        header: 'Quantite',
        filterVariant: 'range',
        filterFn: 'between',
        size: 80,
      },
      {
        accessorKey: 'city',
        header: 'Categorie',
        filterVariant: 'select',
        filterSelectOptions: citiesList, //custom options list (as opposed to faceted list)
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
        id: 'hireDate',
        header: "Date d'jout",
        filterVariant: 'date-range',
        Cell: ({ cell }) => cell.getValue().toLocaleDateString(), // convert back to string for display
      },
      
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
  });

  return <MaterialReactTable table={table} />;
};


const ExampleWithLocalizationProvider = () => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;