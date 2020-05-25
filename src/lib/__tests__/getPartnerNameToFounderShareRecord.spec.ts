import getPartnerNameToFounderShareRecord from '../getPartnerNameToFounderShareRecord'

describe('getPartnerNameToFounderShareRecord', () => {
  test('Returns record', () => {
    const periods: Period[] = [
      {
        date: '2020',
        partners: [
          { name: 'A', work: 1, foundersShare: 0.2 },
          { name: 'B', work: 1, foundersShare: 0.4 },
          { name: 'C', work: 1, foundersShare: 0.6 },
        ],
      },
    ]
    const expected = {
      A: 0.2,
      B: 0.4,
      C: 0.6,
    }
    expect(getPartnerNameToFounderShareRecord(periods)).toStrictEqual(expected)
  })
})
