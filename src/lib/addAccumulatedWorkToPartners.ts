import {
  pipe,
  map,
  assoc,
  mapAccum,
  defaultTo,
  prop,
  props,
  fromPairs,
  mergeWith,
  add,
} from 'ramda'

export default (periods: Period[]): Period[] =>
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
