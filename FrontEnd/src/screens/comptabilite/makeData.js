
  
  //random time today
  const today = () => {
    const today = new Date();
    today.setHours(Math.floor(Math.random() * 24));
    today.setMinutes(Math.floor(Math.random() * 60));
    today.setSeconds(Math.floor(Math.random() * 60));
    return today;
  };
  
  export const data1 = [
    {
      isActive: true,
      name: 'Tanner Linsley',
      hireDate: '2016-02-23T18:25:43.511Z',
      arrivalTime: '2016-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 42,
      salary: 100_000,
      city: 'San Francisco',
      state: 'California',
    },
    {
      isActive: true,
      name: 'Kevin Vandy',
      hireDate: '2019-02-23T18:21:43.335',
      arrivalTime: '2019-02-23T18:21:43.335',
      departureTime: today(),
      age: 51,
      salary: 80_000,
      city: 'Richmond',
      state: 'Virginia',
    },
    {
      isActive: false,
      name: 'John Doe',
      hireDate: '2014-02-23T18:25:43.511Z',
      arrivalTime: '2014-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 27,
      salary: 120_000,
      city: 'Riverside',
      state: 'South Carolina',
    },
    {
      isActive: true,
      name: 'Jane Doe',
      hireDate: '2015-02-25T18:25:43.511Z',
      arrivalTime: '2015-02-25T18:25:43.511Z',
      departureTime: today(),
      age: 32,
      salary: 150_000,
      city: 'San Francisco',
      state: 'California',
    },
    {
      isActive: false,
      name: 'John Smith',
      hireDate: '2023-06-11T18:25:43.511Z',
      arrivalTime: '2023-06-11T18:25:43.511Z',
      departureTime: today(),
      age: 42,
      salary: 75_000,
      city: 'Los Angeles',
      state: 'California',
    },
    {
      isActive: true,
      name: 'Jane Smith',
      hireDate: '2019-02-23T18:21:43.335',
      arrivalTime: '2019-02-23T18:21:43.335',
      departureTime: today(),
      age: 51,
      salary: 56_000,
      city: 'Blacksburg',
      state: 'Virginia',
    },
    {
      isActive: false,
      name: 'Samuel Jackson',
      hireDate: '2010-02-23T18:25:43.511Z',
      arrivalTime: '2010-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 27,
      salary: 90_000,
      city: 'New York',
      state: 'New York',
    },
  ];
  
  export const citiesList = [
    'Entree',
    'Entree',
    'Entree',
    'Entree',
    'Entree',
    'Entree',
  ];
  
  export const usStateList = [
    'California',
    'Virginia',
    'South Carolina',
    'New York',
    'Texas',
  ];

  export const data = [
    {
      isActive: true,
      name: 'Paracetamol',
      hireDate: '2016-02-23T18:25:43.511Z',
      arrivalTime: '2016-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 42,
      salary: 100_000,
      city: 'Entree(vente)',
      state: 'California',
    },
    {
      isActive: true,
      name: 'Diclofenac',
      hireDate: '2019-02-23T18:21:43.335',
      arrivalTime: '2019-02-23T18:21:43.335',
      departureTime: today(),
      age: 51,
      salary: 80_000,
      city: 'Entree(vente)',
      state: 'Virginia',
    },
    {
      isActive: false,
      name: 'Metronidazole',
      hireDate: '2014-02-23T18:25:43.511Z',
      arrivalTime: '2014-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 27,
      salary: 120_000,
      city: 'Entree(vente)',
      state: 'South Carolina',
    },
    {
      isActive: true,
      name: 'Efferagant',
      hireDate: '2015-02-25T18:25:43.511Z',
      arrivalTime: '2015-02-25T18:25:43.511Z',
      departureTime: today(),
      age: 32,
      salary: 150_000,
      city: 'Entree(vente)',
      state: 'California',
    },
    {
      isActive: false,
      name: 'Paracetamol',
      hireDate: '2023-06-11T18:25:43.511Z',
      arrivalTime: '2023-06-11T18:25:43.511Z',
      departureTime: today(),
      age: 42,
      salary: 75_000,
      city: 'Entree(vente)',
      state: 'California',
    },
    {
      isActive: true,
      name: 'Tramadol',
      hireDate: '2019-02-23T18:21:43.335',
      arrivalTime: '2019-02-23T18:21:43.335',
      departureTime: today(),
      age: 51,
      salary: 56_000,
      city: 'Entree(vente)',
      state: 'Virginia',
    },
    {
      isActive: false,
      name: 'Malacur',
      hireDate: '2010-02-23T18:25:43.511Z',
      arrivalTime: '2010-02-23T18:25:43.511Z',
      departureTime: today(),
      age: 27,
      salary: 90_000,
      city: 'Entree(vente)',
      state: 'New York',
    },
    {
        isActive: true,
        name: 'Paracetamol',
        hireDate: '2016-02-23T18:25:43.511Z',
        arrivalTime: '2016-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 100_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Diclofenac',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 80_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Metronidazole',
        hireDate: '2014-02-23T18:25:43.511Z',
        arrivalTime: '2014-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 120_000,
        city: 'Entree(vente)',
        state: 'South Carolina',
      },
      {
        isActive: true,
        name: 'Efferagant',
        hireDate: '2015-02-25T18:25:43.511Z',
        arrivalTime: '2015-02-25T18:25:43.511Z',
        departureTime: today(),
        age: 32,
        salary: 150_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: false,
        name: 'Paracetamol',
        hireDate: '2023-06-11T18:25:43.511Z',
        arrivalTime: '2023-06-11T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 75_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Tramadol',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 56_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Malacur',
        hireDate: '2010-02-23T18:25:43.511Z',
        arrivalTime: '2010-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 90_000,
        city: 'Entree(vente)',
        state: 'New York',
      },
      {
        isActive: true,
        name: 'Paracetamol',
        hireDate: '2016-02-23T18:25:43.511Z',
        arrivalTime: '2016-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 100_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Diclofenac',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 80_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Metronidazole',
        hireDate: '2014-02-23T18:25:43.511Z',
        arrivalTime: '2014-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 120_000,
        city: 'Entree(vente)',
        state: 'South Carolina',
      },
      {
        isActive: true,
        name: 'Efferagant',
        hireDate: '2015-02-25T18:25:43.511Z',
        arrivalTime: '2015-02-25T18:25:43.511Z',
        departureTime: today(),
        age: 32,
        salary: 150_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: false,
        name: 'Paracetamol',
        hireDate: '2023-06-11T18:25:43.511Z',
        arrivalTime: '2023-06-11T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 75_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Tramadol',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 56_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Malacur',
        hireDate: '2010-02-23T18:25:43.511Z',
        arrivalTime: '2010-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 90_000,
        city: 'Entree(vente)',
        state: 'New York',
      },
      {
        isActive: true,
        name: 'Paracetamol',
        hireDate: '2016-02-23T18:25:43.511Z',
        arrivalTime: '2016-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 100_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Diclofenac',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 80_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Metronidazole',
        hireDate: '2014-02-23T18:25:43.511Z',
        arrivalTime: '2014-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 120_000,
        city: 'Entree(vente)',
        state: 'South Carolina',
      },
      {
        isActive: true,
        name: 'Efferagant',
        hireDate: '2015-02-25T18:25:43.511Z',
        arrivalTime: '2015-02-25T18:25:43.511Z',
        departureTime: today(),
        age: 32,
        salary: 150_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: false,
        name: 'Paracetamol',
        hireDate: '2023-06-11T18:25:43.511Z',
        arrivalTime: '2023-06-11T18:25:43.511Z',
        departureTime: today(),
        age: 42,
        salary: 75_000,
        city: 'Entree(vente)',
        state: 'California',
      },
      {
        isActive: true,
        name: 'Tramadol',
        hireDate: '2019-02-23T18:21:43.335',
        arrivalTime: '2019-02-23T18:21:43.335',
        departureTime: today(),
        age: 51,
        salary: 56_000,
        city: 'Entree(vente)',
        state: 'Virginia',
      },
      {
        isActive: false,
        name: 'Malacur',
        hireDate: '2010-02-23T18:25:43.511Z',
        arrivalTime: '2010-02-23T18:25:43.511Z',
        departureTime: today(),
        age: 27,
        salary: 90_000,
        city: 'Entree(vente)',
        state: 'New York',
      },
  ];
  