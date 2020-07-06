import { pipe, ifElse, last, always, clone, reject } from 'ramda'

export default (periods: Period[]): Partner[] =>
  ifElse(
    (periods) => periods.length > 0,
    getPartnersFromLatestPeriod,
    always([])
  )(periods)

const getPartnersFromLatestPeriod = (periods: Period[]): Partner[] =>
  pipe(
    //
    last,
    (p: Period) => clone(p.partners),
    reject(hasReturnedFairShares)
  )(periods)

const hasReturnedFairShares = (p: Partner): boolean =>
  (p.returnedFairShares && p.returnedFairShares > 0) as boolean
