import { map, pipe, sortBy, prop, assoc } from 'ramda'

export default (periods: Period[]): Period[] =>
  map(sortPartnersInPeriod, periods)

const sortPartnersInPeriod = (period: Period): Period =>
  pipe(
    (period: Period): Partner[] => prop('partners', period),
    (partners: Partner[]): Partner[] => sortBy(prop('name'), partners),
    (partners: Partner[]): Period => assoc('partners', partners, period)
  )(period)
