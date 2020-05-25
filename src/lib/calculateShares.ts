import { pipe } from 'ramda'
import addInitialFoundersShare from './addInitialFoundersShare'
import addSumOfWork from './addSumOfWork'
import addAccumulatedWork from './addAccumulatedWork'
import addAccumulatedWorkToPartners from './addAccumulatedWorkToPartners'
import addShareToPartners from './addShareToPartners'
import addSharesInDistribution from './addSharesInDistribution'

const calculateShares = (
  periods: Period[],
  initialFoundersShare: number
): any =>
  pipe(
    addInitialFoundersShare(initialFoundersShare),
    // @todo addFoundersShareToPartners: all new partners have 0 foundersShare, needs to consider returnedFairShares
    addSumOfWork,
    addSharesInDistribution,
    addAccumulatedWork, // @todo needs to consider returnedFairShares
    addAccumulatedWorkToPartners, // @todo needs to consider returnedFairShares
    addShareToPartners(initialFoundersShare)
  )(periods)

export default calculateShares
