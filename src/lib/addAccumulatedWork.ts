import { pipe, mapAccum } from 'ramda'

export default (periods: Period[]): Period[] =>
  pipe(
    mapAccum((accumWork: number, period: Period) => {
      accumWork += period.sumWork!
      period.accumWork = accumWork
      return [accumWork, period]
    }, 0),
    (res: [number, Period[]]) => res[1]
  )(periods)
