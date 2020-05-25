import { assoc, pipe, reduce, head } from 'ramda'

/**
 *
 */
export default (periods: Period[]): Record<string, number> =>
  pipe(
    head,
    (p: Period) => p.partners,
    reduce(
      (acc: Record<string, number>, p: Partner): Record<string, number> =>
        assoc(p.name, p.foundersShare, acc),
      {}
    )
  )(periods)
