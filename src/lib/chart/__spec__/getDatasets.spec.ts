import { keys, values } from 'ramda'
import { getPartnerToSeriesRecords } from '../getDatasets'

describe('getDatasets', () => {
  const sample = require('./samplePeriods.json')

  describe('getPartnerToSeriesRecords', () => {
    test('contains persons as keys', () => {
      const res = getPartnerToSeriesRecords('shares', sample)
      expect(keys(res)).toEqual(
        expect.arrayContaining([
          'Johannes',
          'Anke',
          'Ben',
          'Sven',
          'Michael',
          'Jost',
        ])
      )
    })
    test('contains numbers as values', () => {
      const res = getPartnerToSeriesRecords('accumWork', sample)
      expect(values(res).length).toEqual(7)
    })
  })
})
