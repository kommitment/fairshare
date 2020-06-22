import getPartnersFromLatestPeriod from '../getPartnersFromLatestPeriod'

describe('getPartnersFromLatestPeriod', () => {
  test('Returns empty array', () => {
    expect(getPartnersFromLatestPeriod([])).toStrictEqual([])
  })

  test('Returns partners', () => {
    const partners = [
      { name: 'Hugo', work: 1 },
      { name: 'Kati', work: 1 },
    ]
    const periods = [{ name: 'Year 1', partners }]
    expect(getPartnersFromLatestPeriod(periods)).toStrictEqual(partners)
  })
})
