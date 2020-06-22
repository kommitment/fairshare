import { map, pipe, __, concat, assoc, prop, uniqBy, sortBy } from 'ramda'

export default (names: string[], periods: Period[]): Period[] =>
  pipe(makePartners, mergePartnersIntoPeriods(periods))(names)

const makePartners = (names: string[]): Partner[] =>
  map((name: string) => ({ name, work: 1 }), names)

const mergePartnersIntoPeriods = (periods: Period[]) => (
  partners: Partner[]
): Period[] =>
  map(
    (period: Period): Period =>
      pipe(
        (p: Period) => prop('partners', p),
        concat(partners),
        uniqBy(prop('name')),
        sortBy(prop('name')),
        assoc('partners', __, period)
      )(period),
    periods
  )
// @ts-ignore
