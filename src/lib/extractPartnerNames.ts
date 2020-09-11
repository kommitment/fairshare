import { pipe, reduce, concat, uniq, pluck } from 'ramda'

export default (periods: Period[]): string[] =>
  pipe(
    reduce(
      (names: string[], period: Period) =>
        concat(names, pluck('name', period.partners)),
      []
    ),
    uniq
  )(periods)
