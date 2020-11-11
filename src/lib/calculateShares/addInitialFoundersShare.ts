import { pipe, map, assoc, __, head, pluck, ifElse, contains } from 'ramda'

/**
 * Adds a founderShare property to all partners in the first period.
 * FounderShare multiplied by 100 is the percentage of company shares
 * that are granted to each of the founders.
 */
export default (foundersShare: number) => (periods: Period[]): Period[] =>
  pipe(
    getFounders,
    addFounderShareToPartnersInPeriods(foundersShare, periods)
  )(periods)

/**
 * Returns an array of founder names
 *
 */
const getFounders = (periods: Period[]): string[] =>
  pipe(head, (p: Period) => p.partners, pluck('name'))(periods)

/**
 *
 */
const addFounderShareToPartnersInPeriods = (
  foundersShare: number,
  periods: Period[]
) => (founderNames: string[]): Period[] =>
  map(addFounderShareToPartnersInPeriod(foundersShare, founderNames), periods)

/**
 *
 */
const addFounderShareToPartnersInPeriod = (
  foundersShare: number,
  founderNames: string[]
) => (period: Period): Period =>
  pipe(
    (p: Period): Partner[] => p.partners,
    map(addFounderShareToPartner(foundersShare, founderNames)),
    assoc('partners', __, period)
  )(period)

/**
 * Adds the founder share prop to each partner
 */
const addFounderShareToPartner = (
  foundersShare: number,
  _founderNames: string[]
) => (partner: Partner): Partner =>
  ifElse(
    (p: Partner) => contains(p.name, _founderNames),
    setFounderShare(foundersShare),
    setFounderShare(0)
  )(partner)

/**
 *
 */
const setFounderShare = (founderShare: number) => (partner: Partner): Partner =>
  assoc('foundersShare', founderShare, partner)
