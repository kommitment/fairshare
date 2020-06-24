import {
  pipe,
  mapAccum,
  ifElse,
  concat,
  uniqBy,
  prop,
  sortBy,
  assoc,
} from 'ramda'

export default (
  partnerName: string,
  periodName: string,
  periods: Period[]
): Period[] =>
  pipe(
    (periods: Period[]) =>
      mapAccum(
        addPartnerToPeriodsAfterFirstMatchingPeriod(partnerName, periodName),
        false,
        periods
      ),
    (res: [boolean, Period[]]) => res[1]
  )(periods)

const addPartnerToPeriodsAfterFirstMatchingPeriod = (
  partnerName: string,
  periodName: string
) => (found: boolean, period: Period): [boolean, Period] => {
  const newFound = found || period.name === periodName
  const newPeriod = maybeAddPartnerToPeriod(partnerName)(newFound, period)
  return [newFound, newPeriod]
}

const maybeAddPartnerToPeriod = (partnerName: string) => (
  sure: boolean,
  period: Period
): Period =>
  ifElse(
    () => sure,
    () => addPartnerToPeriod({ name: partnerName, work: 1 }, period),
    () => period
  )('')

const addPartnerToPeriod = (partner: Partner, period: Period): Period =>
  pipe(
    (p: Period) => prop('partners', p),
    concat([partner]),
    uniqBy(prop('name')),
    sortBy(prop('name')),
    (p: Partner[]) => assoc('partners', p, period)
  )(period)
