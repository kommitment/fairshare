import { pipe, concat, uniqBy, prop, sortBy, assoc } from 'ramda'
import applyAfterFirstMatchingPeriod from '@/lib/applyAfterFirstMatchingPeriod'

export default (
  partnerName: string,
  periodName: string,
  periods: Period[]
): Period[] =>
  applyAfterFirstMatchingPeriod(
    addPartnerToPeriod({ name: partnerName, work: 1 }),
    matchPeriodName(periodName),
    periods
  )

const matchPeriodName = (name: string) => (period: Period): boolean =>
  name === period.name

const addPartnerToPeriod = (partner: Partner) => (period: Period): Period =>
  pipe(
    (p: Period) => prop('partners', p),
    concat([partner]),
    uniqBy(prop('name')),
    sortBy(prop('name')),
    (p: Partner[]) => assoc('partners', p, period)
  )(period)
