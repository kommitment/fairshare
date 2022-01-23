import { curry, ifElse, equals, pipe, multiply } from 'ramda'

export default curry(
  (
    foundersShares: number,
    sharesInDistribution: number,
    accumWorkAll: number,
    accumWorkPartner: number,
    returnedFairShares: number = 0
  ): number =>
    pipe(
      ifElse(
        () => equals(0, accumWorkAll),
        () => foundersShares,
        () =>
          foundersShares +
          sharesInDistribution * (accumWorkPartner / accumWorkAll)
      ),
      multiply(1.0 - returnedFairShares)
    )()
)
