import { reduce, pipe, map, assoc, __ } from 'ramda'

export default (periods: Period[]): Period[] =>
  map(
    (period: Period) =>
      pipe(
        (p: Period) => p.partners,
        reduce((sum: number, partner: Partner) => sum + partner.work, 0),
        assoc('sumWork', __, period)
      )(period),
    periods
  )
