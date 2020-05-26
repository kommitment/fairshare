import { reduce, pipe, map, assoc, __, add, defaultTo } from 'ramda'

/**
 * Calculates the sum of work of pertners in a period. Adds the result as
 * sumWork property in all periods.
 */
export default (periods: Period[]): Period[] =>
  map(
    (period: Period) =>
      pipe(
        (p: Period) => p.partners,
        reduce(sumWorkReducer, 0),
        assoc('sumWork', __, period)
      )(period),
    periods
  )

const sumWorkReducer = (sum: number, partner: Partner) =>
  add(sum, defaultTo(0, partner.work))
