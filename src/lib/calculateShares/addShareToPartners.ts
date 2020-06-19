import { pipe, map, assoc, __, defaultTo } from 'ramda'
import calcShare from './calculateFairShare'

/**
 * Add calculated shares to each partner in each period
 */
export default (foundersShare: number) => (periods: Period[]): Period[] =>
  map(
    (period: Period): Period =>
      setShareInPartners(
        foundersShare,
        period.sharesInDistribution!,
        period.accumWork!,
        period
      )
  )(periods)

/**
 *
 */
const setShareInPartners = (
  foundersShare: number,
  sharesInDistribution: number,
  accumWorkAll: number,
  period: Period
): Period =>
  pipe(
    (p: Period) => p.partners,
    map(setShareInPartner(foundersShare, sharesInDistribution, accumWorkAll)),
    assoc('partners', __, period)
  )(period)

/**
 *
 */
const setShareInPartner = (
  foundersShare: number,
  sharesInDistribution: number,
  accumWorkAll: number
) => (partner: Partner): Partner =>
  pipe(
    (p: Partner) =>
      calcShare(
        foundersShare,
        sharesInDistribution,
        accumWorkAll,
        defaultTo(0, p.accumWork),
        defaultTo(0, p.returnedFairShares)
      ),
    assoc('shares', __, partner)
  )(partner)
