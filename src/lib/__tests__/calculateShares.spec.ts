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
    [0, 0, 100, 50, 0],
    [0, 1, 100, 100, 1],
    [0.5, 0.5, 100, 10, 0.55],
    [0.065, 1 - 3 * 0.065, 3, 1, 0.3333333333333333],
    [0.065, 1 - 3 * 0.065, 12, 3, 0.26625],
  ])(
    'calcShare(%d, %d, %d, %d) makes %d',
    (
      foundersShares: number,
      sharesInDistribution: number,
      accumWorkAll: number,
      accumWorkPartner: number,
      expected: number
    ) => {
      expect(
        calcShare(
          foundersShares,
          sharesInDistribution,
          accumWorkAll,
          accumWorkPartner
        )
      ).toBe(expected)
    }
  )
})
