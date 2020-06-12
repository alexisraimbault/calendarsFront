const events = [
  {
    id: 1,
    name: 'test event 1',
    description: 'test event description',
    date: addDays(new Date(), 3),
    time_from: '10:30',
    time_to: '14:30',
    recipients: [
      {
        id: 1011,
        firstname: 'Jean',
        lastname: 'Michel',
      },
      {
        id: 1012,
        firstname: 'Sophie',
        lastname: 'Pic',
      },
      {
        id: 1013,
        firstname: 'Alain',
        lastname: 'Bernard',
      },
    ],
  },
  {
    id: 2,
    name: 'test event 2',
    description: 'test event description',
    date: new Date(),
    time_from: '10:30',
    time_to: '12:30',
    recipients: [
      {
        id: 1011,
        firstname: 'Jean',
        lastname: 'Michel',
      },
      {
        id: 1014,
        firstname: 'Alexis',
        lastname: 'Raimbault',
      },
      {
        id: 1015,
        firstname: 'Clara',
        lastname: 'Blanc',
      },
    ],
  },
  {
    id: 3,
    name: 'test event 3',
    description: 'test event description',
    date: addDays(new Date(), 4),
    time_from: '10:30',
    time_to: '15:30',
    recipients: [
      {
        id: 1011,
        firstname: 'Jean',
        lastname: 'Michel',
      },
      {
        id: 1012,
        firstname: 'Sophie',
        lastname: 'Pic',
      },
      {
        id: 1013,
        firstname: 'Alain',
        lastname: 'Bernard',
      },
    ],
  },
  {
    id: 4,
    name: 'test event 4',
    description: 'test event description',
    date: new Date(),
    time_from: '10:30',
    time_to: '12:30',
    recipients: [
      {
        id: 1014,
        firstname: 'Alexis',
        lastname: 'Raimbault',
      },
      {
        id: 1015,
        firstname: 'Clara',
        lastname: 'Blanc',
      },
    ],
  },
  {
    id: 5,
    name: 'test event 5',
    description: 'test event description',
    date: addDays(new Date(), 4),
    time_from: '10:30',
    time_to: '16:30',
    recipients: [
      {
        id: 1016,
        firstname: 'Tania',
        lastname: 'Sollogoub',
      },
      {
        id: 1017,
        firstname: 'Thierry',
        lastname: 'Henry',
      },
    ],
  },
  {
    id: 6,
    name: 'test event 6',
    description: 'test event description',
    date: addDays(new Date(), 5),
    time_from: '10:30',
    time_to: '12:30',
    recipients: [
      {
        id: 1013,
        firstname: 'Alain',
        lastname: 'Bernard',
      },
    ],
  },
];
