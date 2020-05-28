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
    addAccumulatedWorkToPartners,
    addAccumulatedWorkToPeriods,
    addShareToPartners(initialFoundersShare)
  )(periods)

export default calculateShares
