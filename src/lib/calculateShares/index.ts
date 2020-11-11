import { pipe } from 'ramda'
import addInitialFoundersShare from './addInitialFoundersShare'
import addSumOfWorkToPeriods from './addSumOfWorkToPeriods'
import addAccumulatedWorkToPeriods from './addAccumulatedWorkToPeriods'
import addAccumulatedWorkToPartners from './addAccumulatedWorkToPartners'
import addShareToPartners from './addShareToPartners'
import addSharesInDistribution from './addSharesInDistribution'

const calculateShares = (
  periods: Period[],
  initialFoundersShare: number
): Period[] =>
  pipe(
    addInitialFoundersShare(initialFoundersShare),
    addSumOfWorkToPeriods,
    addSharesInDistribution,
    addAccumulatedWorkToPartners,
    addAccumulatedWorkToPeriods,
    addShareToPartners
  )(periods)

export default calculateShares

// @todo Können wir einen einfachen Text hierfür schreiben?
// @todo Etwa: bei  100% FounderShares kommen am Ende auch 100% Foundershares raus...
