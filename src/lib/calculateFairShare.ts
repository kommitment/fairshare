import { curry } from 'ramda'

export default curry(
  (
    foundersShares: number,
    sharesInDistribution: number,
    accumWorkAll: number,
    accumWorkPartner: number,
    returnedFounderShares: number = 0
  ): number =>
    foundersShares +
    sharesInDistribution *
      ((accumWorkPartner * (1.0 - returnedFounderShares)) / accumWorkAll)
)
