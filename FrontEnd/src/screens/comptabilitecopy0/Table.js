
import React, { useMemo , useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

var services = ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'];
var serviceInput= {
  service1: [12,250,1000,13000],
  service2: [10,200,800,15000],
  service3: [15,300,1200,11000],
  service4: [8,170,700,10000],
  service5: [13,350,1300,14000],
};
var serviceOutput= {
  service2: [12,250,1000,13000],
  service1: [10,200,800,15000],
  service5: [15,300,1200,11000],
  service3: [8,170,700,10000],
  service4: [13,350,1300,14000],
};

// ...

// Dans la fonction setData
function setData(i, typeDonnee) {
  var data = services.map((service, index) => {
    if (typeDonnee === "entree") {
      return {
        service: service,
        entree: serviceInput[`service${index + 1}`][i],
      };
    } else if (typeDonnee === "sortie") {
      return {
        service: service,
        sortie: serviceOutput[`service${index + 1}`][i],
      };
    } else if (typeDonnee === "bilan") {
      return {
        service: service,
        bilan: serviceInput[`service${index + 1}`][i] - serviceOutput[`service${index + 1}`][i],
      };
    } else {
      return {
        service: service,
        entree: serviceInput[`service${index + 1}`][i],
        sortie: serviceOutput[`service${index + 1}`][i],
        bilan: serviceInput[`service${index + 1}`][i] - serviceOutput[`service${index + 1}`][i],
      };
    }
  });

  // Calcul de la somme des entrées, sorties et bilans
  var sumEntree=0 ;
  var sumSortie=0 ;
  var sumBilan=0 ;

  

  if (typeDonnee === "entree") {
    sumEntree = data.reduce((acc, curr) => (curr.entree || 0) + acc, 0);
    data.push({
      service: "Total",
      entree: sumEntree,
    });
  }else if (typeDonnee === "sortie") {
    sumSortie = data.reduce((acc, curr) => (curr.sortie || 0) + acc, 0);
    data.push({
      service: "Total",
      sortie: sumSortie,
    });
  }else if (typeDonnee === "bilan") {
    sumBilan = data.reduce((acc, curr) => (curr.bilan || 0) + acc, 0);
    data.push({
      service: "Total",
      bilan: sumBilan,
    });
  }else  {
    sumEntree = data.reduce((acc, curr) => (curr.entree || 0) + acc, 0);
    sumSortie = data.reduce((acc, curr) => (curr.sortie || 0) + acc, 0);
    sumBilan = data.reduce((acc, curr) => (curr.bilan || 0) + acc, 0);
    data.push({
      service: "Total",
      entree: sumEntree,
      sortie: sumSortie,
      bilan: sumBilan,
    });
  }
  return data;
}


const TableBilan = (props) => {
  
  const columns = useMemo(
    () => {
      if (props.typeDonnee === 'entree') {
        return [
          {
            accessorKey: 'service',
            header: 'Services',
            size: 150,
          },
          {
            accessorKey: 'entree',
            header: 'Entrees',
            size: 150,
          }
        ];
      } else if (props.typeDonnee === 'sortie') {
        return [
          {
            accessorKey: 'service',
            header: 'Services',
            size: 150,
          },
          {
            accessorKey: 'sortie',
            header: 'Sorties',
            size: 150,
          }
        ];
      } else if (props.typeDonnee === 'bilan') {
        return [
          {
            accessorKey: 'service',
            header: 'Services',
            size: 150,
          },
          {
            accessorKey: 'bilan',
            header: 'Bilan',
            size: 150,
          }
        ];
      } else {
        return [
          {
            accessorKey: 'service',
            header: 'Services',
            size: 150,
          },
          {
            accessorKey: 'entree',
            header: 'Entrees',
            size: 150,
          },
          {
            accessorKey: 'sortie',
            header: 'Sorties',
            size: 200,
          },
          {
            accessorKey: 'bilan',
            header: 'Bilan',
            size: 150,
          }
        ];
      }
    },
    [props.typeDonnee]
  );

  var donnee = setData(props.i || 0, props.typeDonnee || null);
  const table = useMaterialReactTable({
    columns,
    data: donnee,

  });

  return <MaterialReactTable table={table} />;
};


export default TableBilan;
