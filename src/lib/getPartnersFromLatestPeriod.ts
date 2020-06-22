import { pipe, ifElse, last, always, clone } from 'ramda'

export default (periods: Period[]): Partner[] =>
  ifElse(
    (periods) => periods.length > 0,
    pipe(last, (p: Period) => clone(p.partners)),
    always([])
  )(periods)
