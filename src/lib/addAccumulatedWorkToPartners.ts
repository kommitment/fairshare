import {
  pipe,
  map,
  assoc,
  mapAccum,
  defaultTo,
  prop,
  reduce,
  mergeWithKey,
  find,
  propEq,
  ifElse,
} from 'ramda'

/**
 * Accumulates the work for each partner in each period and add the value as
 * property in the partner objects.
 */
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
    mergeWithKey(withPartnerNameMerger(getReturnedFairShares(partners)), acc)
  )(partners)

/**
 *
 */
const withPartnerNameMerger = (
  returnedFairSharesResolver: (name: string) => number
) => (partnerName: string, l: any, r: any): any =>
  pipe(
    returnedFairSharesResolver,
    ifElse(
      (rfs: number) => rfs > 0,
      (rfs: number) => mergeWithReturnedFairShares(rfs, l, r),
      (rfs: number) => mergeWithoutReturnedFairShares(rfs, l, r)
    )
  )(partnerName)

/**
 *
 */
const mergeWithReturnedFairShares = (
  rfs: number,
  l: number,
  _r: number
): number => l * (1.0 - rfs)

/**
 *
 */
const mergeWithoutReturnedFairShares = (
  _rfs: number,
  l: number,
  r: number
): number => l + r

/**
 *
 */
const getReturnedFairShares = (partners: Partner[]) => (
  partnerName: string
): number =>
  pipe(
    find(propEq('name', partnerName)),
    defaultTo({}),
    // @ts-ignore
    prop('returnedFairShares'),
    defaultTo(0)
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
