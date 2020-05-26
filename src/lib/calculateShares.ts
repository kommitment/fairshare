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
): any =>
  pipe(
    addInitialFoundersShare(initialFoundersShare),
    addSumOfWorkToPeriods,
    addSharesInDistribution,
    addAccumulatedWorkToPeriods, // @todo needs to consider returnedFairShares
    addAccumulatedWorkToPartners, // @todo needs to consider returnedFairShares
    addShareToPartners(initialFoundersShare)
  )(periods)

export default calculateShares
