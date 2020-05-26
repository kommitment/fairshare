import {
  pipe,
  map,
  assoc,
  mapAccum,
  defaultTo,
  prop,
  mergeWith,
  add,
  reduce,
} from 'ramda'

/**
 * Accumulates the work for each partner in each period and add the value as
 * property in the partner objects.
 */
// @todo needs to consider returnedFairShares
export default (periods: Period[]): Period[] =>
  pipe(
    mapAccum((acc: Record<string, number>, period: Period) => {
      const newAcc = accumulateWorkOfPartners(acc, period.partners)
      const newPeriod = assoc(
        'partners',
        addAccumulatedWorkToPartners(newAcc, period.partners),
        period
      )
      return [newAcc, newPeriod]
    }, {}),
    (res: [any, Period[]]) => res[1]
  )(periods)

/**
 *
 */
const accumulateWorkOfPartners = (
  acc: Record<string, number>,
  partners: Partner[]
): Record<string, number> =>
  pipe(
    reduce(
      (acc: Record<string, number>, p: Partner): Record<string, number> =>
        assoc(p.name, p.work, acc),
      {}
    ),
    mergeWith(add, acc)
  )(partners)

/**
 *
 */
const addAccumulatedWorkToPartners = (
  acc: Record<string, number>,
  partners: Partner[]
): Partner[] =>
  map(
    (p: Partner): Partner =>
      assoc('accumWork', defaultTo(0, prop(p.name, acc)), p)
  )(partners)
