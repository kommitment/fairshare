import { pipe, mapAccum, defaultTo, add, assoc, reduce } from 'ramda'

/**
 * Accumulates the work and adds the value to each period. Returned fair shares
 * decrease the accumulated work.
 */
export default (periods: Period[]): Period[] =>
  pipe(
    mapAccum((acc: number, period: Period) => {
      const newAcc = accumulateWork(acc, period)
      const newPeriod = assoc('accumWork', newAcc, period)
      return [newAcc, newPeriod]
    }, 0),
    (res: [number, Period[]]) => res[1]
  )(periods)

const accumulateWork = (acc: number, period: Period): number =>
  pipe(
    (period: Period) => defaultTo(0, period.sumWork),
    add(acc),
    (acc: number) =>
      reduce(decreaseWithReturnedFairShares, acc, period.partners)
  )(period)

const decreaseWithReturnedFairShares = (
  acc: number,
  partner: Partner
): number =>
  acc -
  defaultTo(0, partner.accumWork) * defaultTo(0, partner.returnedFairShares)
