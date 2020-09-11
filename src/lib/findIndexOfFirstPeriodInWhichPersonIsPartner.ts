import { findIndex, find, propEq } from 'ramda'

export default (partnerName: string, periods: Period[]): number =>
  findIndex(findPartnerNameInPeriod(partnerName))(periods)

const findPartnerNameInPeriod = (partnerName: string) => (
  period: Period
): any => find(propEq('name', partnerName))(period.partners)
