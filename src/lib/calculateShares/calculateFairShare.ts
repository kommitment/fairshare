import { curry, ifElse, equals } from 'ramda'

export default curry(
  (
    foundersShares: number,
    sharesInDistribution: number,
    accumWorkAll: number,
    accumWorkPartner: number,
    returnedFairShares: number = 0
  ): number =>
    ifElse(
      () => equals(0, accumWorkAll),
      () => foundersShares,
      () =>
        foundersShares +
        sharesInDistribution *
          ((accumWorkPartner * (1.0 - returnedFairShares)) / accumWorkAll)
    )(undefined)
)
