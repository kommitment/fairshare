import { pipe, concat, uniqBy, prop, sortBy, assoc, clone } from 'ramda'
import applyAfterFirstMatchingPeriod from '@/lib/applyAfterFirstMatchingPeriod'

export default (
  partnerName: string,
  periodName: string,
  periods: Period[]
): Period[] =>
  applyAfterFirstMatchingPeriod(
    addPartnerToPeriod(partnerName),
    matchPeriodName(periodName),
    periods
  )

const matchPeriodName = (name: string) => (period: Period): boolean =>
  name === period.name

const addPartnerToPeriod = (partnerName: string) => (period: Period): Period =>
  pipe(
    (p: Period) => prop('partners', p),
    concat([{ name: partnerName, work: 1 }]),
    uniqBy(prop('name')),
    sortBy(prop('name')),
    (p: Partner[]) => assoc('partners', p, period)
  )(period)
