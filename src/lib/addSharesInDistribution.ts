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
  pluck,
  sum,
  path,
  multiply,
  prop,
} from 'ramda'
import getPartnerNameToFounderShareRecord from './getPartnerNameToFounderShareRecord'

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
      accumSharesInDistribution(getPartnerNameToFounderShareRecord(periods)),
      getInitialSharesInDistribution(periods)
    ),
    (res: [any, Period[]]) => res[1],
    // @ts-ignore
    (t: Period[]): Period[] => [head(periods), ...t]
  )(periods)

/**
 *
 */
const getInitialSharesInDistribution = (periods: Period[]): number =>
  defaultTo(1, path([0, 'sharesInDistribution'], periods))

/**
 *
 */
const accumSharesInDistribution = (
  foundersShareRecord: Record<string, number>
) => (acc: number, period: Period): [number, Period] => {
  acc += getReturnedFairShares(foundersShareRecord, period.partners)
  return [acc, assoc('sharesInDistribution', acc, period)]
}

/**
 *
 */
const getReturnedFairShares = (
  foundersShareRecord: Record<string, number>,
  partners: Partner[]
): number =>
  reduce(
    (acc: number, partner: Partner): number =>
      pipe(
        (p: Partner): string => prop('name', p),
        (n: string): number => defaultTo(0, prop(n, foundersShareRecord)),
        multiply(defaultTo(0, partner.returnedFairShares)),
        add(acc)
      )(partner),
    0
  )(partners)
