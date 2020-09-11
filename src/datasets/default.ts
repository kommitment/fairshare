const history: Period[] = [
  {
    name: 'Year 1',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: 'Year 2',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: 'Year 3',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ralf', work: 0, returnedFairShares: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: 'Year 4',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: 'Year 5',
    partners: [
      { name: 'Anke', work: 1 },
      { name: 'Ben', work: 1 },
      { name: 'Johannes', work: 1 },
    ],
  },
  {
    name: 'Year 6',
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
    name: 'Year 7',
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
