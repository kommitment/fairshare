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
 * Adds a value for sharesInDistrubution to each period. SharesInDistribution
 * multiplied by 100 percentage of company shares that are distributed as fair shares.
 */
export default (periods: Period[]): Period[] =>
  pipe(
    initializeSharesInDistributionWithFoundersShare,
    increaseSharesInDistributionWithReturnedFoundersShare
  )(periods)

/**
 * In the first period the sharesInDistribution are generated from the sum of all founderShares.
 */
const initializeSharesInDistributionWithFoundersShare = (
  periods: Period[]
): Period[] =>
  pipe(
    head,
    (p: Period) => p.partners,
    calculateInitialSharesInDistribution,
    assoc('sharesInDistribution', __, head(periods)),
    (h: Period) => [h, ...tail(periods)]
  )(periods)

/**
 *
 */
const calculateInitialSharesInDistribution = (partners: Partner[]): number =>
  pipe(
    // @ts-ignore
    pluck('foundersShare'),
    sum,
    subtract(1)
  )(partners)

/**
 * Returned founder shares increase the shares in distribution
 */
const increaseSharesInDistributionWithReturnedFoundersShare = (
  periods: Period[]
): Period[] =>
  pipe(
    mapAccum(
      accumSharesInDistribution(getPartnerNameToFounderShareRecord(periods)),
      getInitialSharesInDistribution(periods)
    ),
    (res: [any, Period[]]) => res[1]
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
  const newAcc = add(
    acc,
    getReturnedFoundersSharesFromPartners(foundersShareRecord, period.partners)
  )
  const newPeriod = assoc('sharesInDistribution', acc, period)
  return [newAcc, newPeriod]
}

/**
 * Returns a value for the returned founder shares among a list of partners.
 */
const getReturnedFoundersSharesFromPartners = (
  foundersShareRecord: Record<string, number>,
  partners: Partner[]
): number =>
  reduce(
    (acc: number, partner: Partner): number =>
      add(
        acc,
        getReturnedFoundersSharesFromPartner(foundersShareRecord, partner)
      ),
    0
  )(partners)

/**
 * Returns a value for the returned founder shares of a partner.
 */
const getReturnedFoundersSharesFromPartner = (
  foundersShareRecord: Record<string, number>,
  partner: Partner
): number =>
  pipe(
    (p: Partner): string => prop('name', p),
    (name: string): number => defaultTo(0, prop(name, foundersShareRecord)),
    multiply(defaultTo(0, partner.returnedFairShares))
  )(partner)
