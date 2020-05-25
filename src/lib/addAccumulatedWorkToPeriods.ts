import { pipe, mapAccum, defaultTo, add, assoc, lensProp, view } from 'ramda'

export default (periods: Period[]): Period[] =>
  pipe(
    mapAccum((acc: number, period: Period) => {
      const newAcc = add(acc, defaultTo(0, getSumWork(period)))
      const newPeriod = assoc('accumWork', acc, period)
      return [newAcc, newPeriod]
    }, 0),
    (res: [number, Period[]]) => res[1]
  )(periods)

const sumWorkLens = lensProp('sumWork')
const getSumWork = (p: Period): number => view(sumWorkLens, p)
