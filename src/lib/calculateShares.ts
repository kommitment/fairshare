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
} from 'ramda'

const calculateShares = (
  historyArr: history[],
  initialFoundersShare: number
): any =>
  pipe(
    addSumOfWork,
    addAccumulatedWork,
    addInitialFounderShare(initialFoundersShare),
    addAccumulatedWorkToPartners
  )(historyArr)

/**
 *
 */
const addSumOfWork = (historyArr: history[]): history[] =>
  map(
    (history: history) =>
      pipe(
        (h: history) => h.partners,
        reduce((sum: number, partner: historyPartner) => sum + partner.work, 0),
        assoc('sumWork', __, history)
      )(history),
    historyArr
  )

/**
 *
 */
const addAccumulatedWork = (historyArr: history[]): history[] =>
  pipe(
    mapAccum((accumWork: number, history: history) => {
      accumWork += history.sumWork!
      history.accumWork = accumWork
      return [accumWork, history]
    }, 0),
    (res: [number, history[]]) => res[1]
  )(historyArr)

/**
 *
 */
const addInitialFounderShare = (foundersShare: number) => (
  historyArr: history[]
): history[] =>
  pipe(
    head,
    addInitialFounderShareToHistory(foundersShare),
    (h: history): history[] => [h, ...tail(historyArr)]
  )(historyArr)

/**
 *
 */
const addInitialFounderShareToHistory = (foundersShare: number) => (
  history: history
): history =>
  pipe(
    (h: history) => h.partners,
    map(
      (p: historyPartner): historyPartner =>
        assoc('foundersShare', foundersShare, p)
    ),
    assoc('partners', __, history)
  )(history)

/**
 *
 */
const addAccumulatedWorkToPartners = (historyArr: history[]): history[] =>
  pipe(
    mapAccum((acc: Record<string, number>, history: history) => {
      acc = accumulateWorkOfPartners(acc, history.partners)
      const partners = setAccumulatedWorkToPartners(acc, history.partners)
      history = assoc('partners', partners, history)
      return [acc, history]
    }, {}),
    (res: [any, history[]]) => res[1]
  )(historyArr)

/**
 *
 */
const accumulateWorkOfPartners = (
  acc: Record<string, number>,
  partners: historyPartner[]
): Record<string, number> =>
  // @ts-ignore
  pipe(map(props(['name', 'work'])), fromPairs, mergeWith(add, acc))(partners)

/**
 *
 */
const setAccumulatedWorkToPartners = (
  acc: Record<string, number>,
  partners: historyPartner[]
): historyPartner[] =>
  pipe(
    map(
      (p: historyPartner): historyPartner =>
        assoc('accumWork', defaultTo(0, prop(p.name, acc)), p)
    )
  )(partners)

/**
 *
 */
const calcShare = (
  foundersShares: number,
  sharesInDistribution: number,
  accumWorkPartner: number,
  accumWorkAll: number
): number =>
  foundersShares + sharesInDistribution * (accumWorkPartner / accumWorkAll)

export { calcShare }
export default calculateShares
