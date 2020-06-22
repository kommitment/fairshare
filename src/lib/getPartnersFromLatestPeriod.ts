import { pipe, ifElse, last, always } from 'ramda'

export default (periods: Period[]): Partner[] =>
  ifElse(
    (periods) => periods.length > 0,
    pipe(last, (p: Period) => p.partners),
    always([])
  )(periods)
