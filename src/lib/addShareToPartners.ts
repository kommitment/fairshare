import { pipe, map, assoc, __, prop } from 'ramda'
import calcShare from './calcShare'

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
    // @ts-ignore
    prop('partners'),
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
) => (partner: Partner): Period =>
  pipe(
    // @ts-ignore
    prop('accumWork'),
    calcShare(foundersShare, sharesInDistribution, accumWorkAll),
    assoc('shares', __, partner)
  )(partner)
