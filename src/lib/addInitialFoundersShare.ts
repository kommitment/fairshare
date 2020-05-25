import { pipe, map, assoc, __, head, tail } from 'ramda'

/**
 *
 */
export default (foundersShare: number) => (periods: Period[]): Period[] =>
  pipe(
    head,
    addInitialFounderShareToperiod(foundersShare),
    (p: Period): Period[] => [p, ...tail(periods)]
  )(periods)

/**
 *
 */
const addInitialFounderShareToperiod = (foundersShare: number) => (
  period: Period
): Period =>
  pipe(
    (p: Period) => p.partners,
    map((p: Partner): Partner => assoc('foundersShare', foundersShare, p)),
    assoc('partners', __, period)
  )(period)
