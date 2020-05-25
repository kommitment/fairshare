import {
  reduce,
  pipe,
  assoc,
  __,
  mapAccum,
  defaultTo,
  head,
  tail,
  add,
  subtract,
  reject,
  isNil,
  pluck,
  sum,
  path,
} from 'ramda'

/**
 *
 */
export default (periods: Period[]): Period[] =>
  pipe(
    initializeSharesInDistributionWithFoundersShare,
    increaseSharesInDistributionWithReturnedFoundersShare
  )(periods)

/**
 *
 */
const initializeSharesInDistributionWithFoundersShare = (
  periods: Period[]
): Period[] =>
  pipe(
    head,
    (p) => p.partners,
    pluck('foundersShare'),
    sum,
    subtract(1),
    assoc('sharesInDistribution', __, head(periods)),
    (h: Period): Period[] => [h, ...tail(periods)]
  )(periods)

/**
 *
 */
const increaseSharesInDistributionWithReturnedFoundersShare = (
  periods: Period[]
): Period[] =>
  pipe(
    // get current Value from first element
    // use it in subsequent
    tail,
    mapAccum(
      accumSharesInDistribution,
      getInitialSharesInDistribution(periods)
    ),
    (res: [any, Period[]]) => res[1],
    // @ts-ignore
    (t: Period[]): Period[] => [head(periods), ...t]
  )(periods)

const getInitialSharesInDistribution = (periods: Period[]): number =>
  defaultTo(1, path([0, 'sharesInDistribution'], periods))

/**
 *
 */
const accumSharesInDistribution = (
  acc: number,
  period: Period
): [number, Period] => {
  acc += getSumOfReturnedFairShares(period.partners)
  return [acc, assoc('sharesInDistribution', acc, period)]
}

/**
 *
 */
const getSumOfReturnedFairShares = (partners: Partner[]): number =>
  pipe(
    pluck('returnedFairShares'),
    // @ts-ignore
    reject(isNil),
    reduce((acc: number, num: number): number => add(acc, num), 0)
  )(partners)
