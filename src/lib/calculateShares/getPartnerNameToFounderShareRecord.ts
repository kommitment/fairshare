import { assoc, pipe, reduce, head } from 'ramda'

/**
 * Returns a record with partner names as keys and foundersShare as values.
 */
export default (periods: Period[]): Record<string, number> =>
  pipe(
    head,
    (p: Period) => p.partners,
    reduce(
      (acc: Record<string, number>, p: Partner): Record<string, number> =>
        assoc(p.name, p.foundersShare, acc) as Record<string, number>,
      {}
    )
  )(periods)
