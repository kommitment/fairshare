import { pipe, map, assoc, __, head, tail } from 'ramda'

/**
 * Adds a founderShare property to all partners in the first period.
 * FounderShare multiplied by 100 is the percentage of company shares
 * that are granted to each of the founders.
 */
export default (foundersShare: number) => (periods: Period[]): Period[] =>
  pipe(
    head,
    addFounderShareToPartners(foundersShare),
    (p: Period): Period[] => [p, ...tail(periods)]
  )(periods)

/**
 *
 */
const addFounderShareToPartners = (foundersShare: number) => (
  period: Period
): Period =>
  pipe(
    (p: Period) => p.partners,
    map((p: Partner): Partner => assoc('foundersShare', foundersShare, p)),
    assoc('partners', __, period)
  )(period)
