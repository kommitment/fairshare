import util from 'util'
import calculateShares from '../'
import dataset from '../../../datasets/default'

describe('calculateFairShare', () => {
  test('calculateShares', () => {
    console.log(util.inspect(calculateShares(dataset, 0.065), { depth: 4 }))
  })
})
