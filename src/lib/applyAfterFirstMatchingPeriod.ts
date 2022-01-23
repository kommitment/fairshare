import { pipe, mapAccum, ifElse, addIndex } from 'ramda'

export default (
  applyFn: (period: Period, idx: number) => Period,
  matcherFn: (period: Period, idx: number) => boolean,
  periods: Period[]
): Period[] =>
  pipe(
    (periods: Period[]): [boolean, Period[]] =>
      // @ts-ignore
      mapAccumIndexed(applyAfterFirstMatch(applyFn, matcherFn), false, periods),
    (res: [boolean, Period[]]) => res[1]
  )(periods)

const mapAccumIndexed = addIndex(mapAccum)

const applyAfterFirstMatch = (
  applyFn: (period: Period, idx: number) => Period,
  matcherFn: (period: Period, idx: number) => boolean
) => (found: boolean, period: Period, idx: number): [boolean, Period] => {
  const newFound: boolean = found || matcherFn(period, idx)
  const newPeriod: Period = maybeApplyToPeriod(applyFn, newFound, period, idx)
  return [newFound, newPeriod]
}

const maybeApplyToPeriod = (
  fn: (period: Period, idx: number) => Period,
  sure: boolean,
  period: Period,
  idx: number
): Period =>
  ifElse(
    () => sure,
    () => fn(period, idx),
    () => period
  )()
