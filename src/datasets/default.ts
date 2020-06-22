const history: Period[] = [
  {
    name: '2016',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2017',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2018',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 0, returnedFairShares: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2019',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2020',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2021',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Jost', work: 1 },
      { name: 'Michael', work: 1 },
      { name: 'Sven', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: '2022',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Jost', work: 0.5 },
      { name: 'Michael', work: 1 },
      { name: 'Sven', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
]

export default history
