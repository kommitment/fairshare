import {
  reduce,
  pipe,
  map,
  assoc,
  __,
  mapAccum,
  defaultTo,
  prop,
  head,
  tail,
  props,
  fromPairs,
  mergeWith,
  add,
  subtract,
  reject,
  isNil,
  curry,
  tap,
} from 'ramda'

const calculateShares = (
  periods: Period[],
  initialFoundersShare: number
): any =>
  pipe(
    addInitialFoundersShare(initialFoundersShare),
    // @todo addFoundersShareToPartners: all new partners have 0 foundersShare, needs to consider returnedFairShares
    addSumOfWork,
    addAccumulatedWork, // @todo needs to consider returnedFairShares
    addAccumulatedWorkToPartners, // @todo needs to consider returnedFairShares
    addSharesInDistribution, // @todo needs to consider returnedFairShares
    addShareToPartners(initialFoundersShare)
  )(periods)

/**
 *
 */
const addSumOfWork = (periods: Period[]): Period[] =>
  map(
    (period: Period) =>
      pipe(
        (p: Period) => p.partners,
        reduce((sum: number, partner: Partner) => sum + partner.work, 0),
        assoc('sumWork', __, period)
      )(period),
    periods
  )

/**
 *
 */
const addAccumulatedWork = (periods: Period[]): Period[] =>
  pipe(
    mapAccum((accumWork: number, period: Period) => {
      accumWork += period.sumWork!
      period.accumWork = accumWork
      return [accumWork, period]
    }, 0),
    (res: [number, Period[]]) => res[1]
  )(periods)

/**
 *
 */
const addInitialFoundersShare = (foundersShare: number) => (
  periods: Period[]
): Period[] =>
  pipe(
    head,
    addInitialFounderShareToperiod(foundersShare),
    (p: Period): Period[] => [p, ...tail(periods)]
  )(periods)

/**
 *
 */
const addInitialFounderShareToperiod = (foundersShare: number) => (
  period: Period
): Period =>
  pipe(
    (p: Period) => p.partners,
    map((p: Partner): Partner => assoc('foundersShare', foundersShare, p)),
    assoc('partners', __, period)
  )(period)

/**
 *
 */
const addAccumulatedWorkToPartners = (periods: Period[]): Period[] =>
  pipe(
    mapAccum((acc: Record<string, number>, period: Period) => {
      acc = accumulateWorkOfPartners(acc, period.partners)
      const partners = setAccumulatedWorkToPartners(acc, period.partners)
      period = assoc('partners', partners, period)
      return [acc, period]
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
  // @ts-ignore
  pipe(map(props(['name', 'work'])), fromPairs, mergeWith(add, acc))(partners)

/**
 *
 */
const setAccumulatedWorkToPartners = (
  acc: Record<string, number>,
  partners: Partner[]
): Partner[] =>
  pipe(
    map(
      (p: Partner): Partner =>
        assoc('accumWork', defaultTo(0, prop(p.name, acc)), p)
    )
  )(partners)

/**
 *
 */
const addSharesInDistribution = (periods: Period[]): Period[] =>
  pipe(
    mapAccum(accumSharesInDistribution, 1),
    (res: [any, Period[]]) => res[1]
  )(periods)

/**
 *
 */
const accumSharesInDistribution = (
  acc: number,
  period: Period
): [number, Period] => {
  acc = getSharesInDistribution(acc, period.partners)
  return [acc, assoc('sharesInDistribution', acc, period)]
}

/**
 *
 */
const getSharesInDistribution = (
  sharesInDistribution: number,
  partners: Partner[]
): number =>
  pipe(
    // @ts-ignore
    map(prop('foundersShare')),
    // @ts-ignore
    reject(isNil),
    reduce((acc: number, num: number): number => add(acc, num), 0),
    subtract(sharesInDistribution)
  )(partners)

/**
 *
 */
const addShareToPartners = (foundersShare: number) => (
  periods: Period[]
): Period[] =>
  map(
    (period: Period): Period =>
      setShareInPartners(
        foundersShare,
        period.sharesInDistribution!,
        period.accumWork!,
        period
      )
  )(periods)

/**
 *
 */
const setShareInPartners = (
  foundersShare: number,
  sharesInDistribution: number,
  accumWorkAll: number,
  period: Period
): Period =>
  pipe(
    // @ts-ignore
    prop('partners'),
    map(setShareInPartner(foundersShare, sharesInDistribution, accumWorkAll)),
    assoc('partners', __, period)
  )(period)

/**
 *
 */
const setShareInPartner = (
  foundersShare: number,
  sharesInDistribution: number,
  accumWorkAll: number
) => (partner: Partner): Period =>
  pipe(
    // @ts-ignore
    prop('accumWork'),
    calcShare(foundersShare, sharesInDistribution, accumWorkAll),
    assoc('shares', __, partner)
  )(partner)

/**
 *
 */
const calcShare = curry(
  (
    foundersShares: number,
    sharesInDistribution: number,
    accumWorkAll: number,
    accumWorkPartner: number
  ): number =>
    foundersShares + sharesInDistribution * (accumWorkPartner / accumWorkAll)
)

export { calcShare }
export default calculateShares
