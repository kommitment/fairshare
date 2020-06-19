import calculateFairShare from '../calculateFairShare'

describe('calculateFairShare', () => {
  test.each([
    [0, 0, 100, 50, 0, 0],
    [0, 1, 100, 100, 0, 1],
    [0.5, 0.5, 100, 10, 0, 0.55],
    [0.065, 1 - 3 * 0.065, 3, 1, 0, 0.3333333333333333],
    [0.065, 1 - 3 * 0.065, 12, 3, 0, 0.26625],
    [0.5, 1, 10, 10, 1, 0.5],
    [0.5, 1, 0, 0, 1, 0.5],
  ])(
    'calculateFairShare(%d, %d, %d, %d, %d) makes %d',
    (
      foundersShares: number,
      sharesInDistribution: number,
      accumWorkAll: number,
      accumWorkPartner: number,
      returnedFairShares: number,
      expected: number
    ) => {
      expect(
        calculateFairShare(
          foundersShares,
          sharesInDistribution,
          accumWorkAll,
          accumWorkPartner,
          returnedFairShares
        )
      ).toBe(expected)
    }
  )
})
