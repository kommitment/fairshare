import util from 'util'
import calculateShares, { calcShare } from '../calculateShares'
import dataset from '../../datasets/default'

describe('calculateShares', () => {
  test('calculateShares', () => {
    console.log(util.inspect(calculateShares(dataset, 0.065), { depth: 4 }))
  })
})

describe('calcShare', () => {
  test.each([
    [0, 0, 50, 100, 0],
    [0, 1, 100, 100, 1],
    [0.5, 0.5, 10, 100, 0.55],
    [0.065, 1 - 3 * 0.065, 1, 3, 0.3333333333333333],
    [0.065, 1 - 3 * 0.065, 3, 12, 0.26625],
  ])(
    'calcShare(%d, %d, %d, %d) makes %d',
    (
      foundersShares: number,
      sharesInDistribution: number,
      accumWorkPartner: number,
      accumWorkAll: number,
      expected: number
    ) => {
      expect(
        calcShare(
          foundersShares,
          sharesInDistribution,
          accumWorkPartner,
          accumWorkAll
        )
      ).toBe(expected)
    }
  )
})
