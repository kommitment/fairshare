import { map } from 'ramda'
import removePartnerFromPeriod from '@/lib/removePartnerFromPeriod'

export default (partnerName: string, periods: Period[]): Period[] =>
  map(removePartnerFromPeriod(partnerName), periods)
