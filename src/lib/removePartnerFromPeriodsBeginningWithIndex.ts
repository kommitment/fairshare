import removePartnerFromPeriod from '@/lib/removePartnerFromPeriod'
import applyAfterFirstMatchingPeriod from '@/lib/applyAfterFirstMatchingPeriod'

export default (
  idxOfInterest: number,
  partnerName: string,
  periods: Period[]
): Period[] =>
  applyAfterFirstMatchingPeriod(
    removePartnerFromPeriod(partnerName),
    matchPeriodIndex(idxOfInterest),
    periods
  )

const matchPeriodIndex = (idxOfInterest: number) => (
  _period: Period,
  idx: number
): boolean => idxOfInterest === idx
