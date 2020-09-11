import getPartnersFromLatestPeriod from '../getPartnersFromLatestPeriod'

describe('getPartnersFromLatestPeriod', () => {
  test('Returns empty array', () => {
    expect(getPartnersFromLatestPeriod([])).toStrictEqual([])
  })

  test('Returns partners', () => {
    const partners: Partner[] = [
      { name: 'Hugo', work: 1 },
      { name: 'Kati', work: 1 },
    ]
    const periods = [{ name: 'Year 1', partners }]
    expect(getPartnersFromLatestPeriod(periods)).toStrictEqual(partners)
  })

  test('Returns partners without partners that left', () => {
    const expectedPartners: Partner[] = [
      { name: 'Hugo', work: 1 },
      { name: 'Kati', work: 1 },
    ]
    const excludedPartners: Partner[] = [
      { name: 'Murat', work: 1, returnedFairShares: 1 },
    ]
    const partners: Partner[] = [...excludedPartners, ...expectedPartners]
    const periods = [{ name: 'Year 1', partners }]
    expect(getPartnersFromLatestPeriod(periods)).toStrictEqual(expectedPartners)
  })
})
