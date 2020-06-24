import { pipe, mapAccum, ifElse } from 'ramda'

export default (
  applyFn: (period: Period) => Period,
  matcherFn: (period: Period) => boolean,
  periods: Period[]
): Period[] =>
  pipe(
    (periods: Period[]) =>
      mapAccum(applyAfterFirstMatch(applyFn, matcherFn), false, periods),
    (res: [boolean, Period[]]) => res[1]
  )(periods)

const applyAfterFirstMatch = (
  applyFn: (period: Period) => Period,
  matcherFn: (period: Period) => boolean
) => (found: boolean, period: Period): [boolean, Period] => {
  const newFound = found || matcherFn(period)
  const newPeriod = maybeApplyToPeriod(applyFn, newFound, period)
  return [newFound, newPeriod]
}

const maybeApplyToPeriod = (
  fn: (period: Period) => Period,
  sure: boolean,
  period: Period
): Period =>
  ifElse(
    () => sure,
    () => fn(period),
    () => period
  )('')
