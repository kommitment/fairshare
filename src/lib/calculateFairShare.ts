import { curry } from 'ramda'

export default curry(
  (
    foundersShares: number,
    sharesInDistribution: number,
    accumWorkAll: number,
    accumWorkPartner: number
  ): number =>
    foundersShares + sharesInDistribution * (accumWorkPartner / accumWorkAll)
)
