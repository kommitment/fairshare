import { pipe, mapAccum, defaultTo, add, lensProp, view, set } from 'ramda'

/**
 * Accumulates the work and adds the value to each period
 */
export default (periods: Period[]): Period[] =>
  pipe(
    mapAccum((acc: number, period: Period) => {
      const newAcc = add(acc, defaultTo(0, getSumWork(period)))
      const newPeriod = setAccumWork(newAcc, period)
      return [newAcc, newPeriod]
    }, 0),
    (res: [number, Period[]]) => res[1]
  )(periods)

const accumWorkLens = lensProp('accumWork')
const setAccumWork = set(accumWorkLens)
const sumWorkLens = lensProp('sumWork')
const getSumWork = (p: Period): number => view(sumWorkLens, p)
