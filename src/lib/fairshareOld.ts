import { reduce } from 'ramda'

const getSumWork = (historyPartner: Partner[]): number =>
  reduce(
    (sum: number, partner: Partner) => sum + partner.work,
    0,
    historyPartner
  )

/* input is like..
  [{
    date : 2016-04-13,
    partners : [
        {
          name : "Anke Nehrenberg",
          work: 1
        },
        {
          name : "Ralf Wirdemann",
          work: 1, returnedFairShares: 1
        },
        {
          name : "Johannes Mainusch",
          work: 1
        }]
    },
    ...
  ]

    steps:
    - for each period
      - sum up Arbeit of each kommanditist
      - in first period give each found initalFounderSharePercent
      - sum up sharesInDistribution
*/
const fairshare = (input: Period[], initialFoundersShare: number): any => {
  const result: any[] = []
  const shares: { [key: string]: { [key: string]: any } } = {}

  let totalSumFairShares: number = 0
  for (let period: number = 0; period < input.length; period++) {
    // find the SumArbeit (sum of Arbeit)
    const partners = input[period].partners
    const SumArbeit = getSumWork(partners)
    let sharesInDistribution: number = 1

    totalSumFairShares += SumArbeit

    // loop through partners to find the "SumArbeit"  of this year
    for (const i in partners) {
      const name = partners[i].name
      shares[name] = {}
      shares[name].foundersShare = shares[name].foundersShare || 0
      if (period === 0) {
        // this is the first round, i.e. all partners in this period are founders...
        // founders get founders shares, if period<1 then these are founders...
        shares[name].foundersShare = initialFoundersShare
      }
      // sharesInDistribution, the shares to be ditributed...
      sharesInDistribution -= shares[name].foundersShare
    }

    result[period] = {}
    result[period].period = period
    result[period].date = input[period].date
    result[period].totalSumFairShares = totalSumFairShares
    result[period].checks = ''
    result[period].SumArbeit = SumArbeit

    //
    const anteil: any = {}
    // loop through partners to calculate shares
    for (const i in partners) {
      const name = partners[i].name
      const returnedFairShares = partners[i].returnedFairShares || 0
      anteil[name] = {}
      // handle returnedFairShares
      if (returnedFairShares > 1) {
        const reduceBy = 1.0 - returnedFairShares
        const sunkenShares =
          (shares[name].sumOfFairShares * returnedFairShares) / 100
        anteil[name].returnedFairShares =
          returnedFairShares +
          '= ' +
          Math.round(shares[name].sumOfFairShares) +
          ' incl. ' +
          shares[name].foundersShare +
          '% FS'
        // return founderShares to sharesInDistribution...
        sharesInDistribution += shares[name].foundersShare
        // reset shares of kommanditist
        shares[name].sumOfFairShares *= reduceBy
        shares[name].foundersShare *= reduceBy
        // now remove the returned shareds from the
        totalSumFairShares -= sunkenShares
        result[period].totalSumFairShares =
          Math.round(100 * totalSumFairShares) / 100
      }

      //
      // use Arbeit  as share generator
      shares[name].fairShares = partners[i].work
      shares[name].sumOfFairShares = shares[name].sumOfFairShares || 0
      shares[name].sumOfFairShares += shares[name].fairShares
      shares[name].anteil =
        shares[name].foundersShare +
        (sharesInDistribution * shares[name].sumOfFairShares) /
          totalSumFairShares

      //
      result[period][name].foundersShare = shares[name].foundersShare
      result[period][name].work = partners[i].work
      result[period][name].fairShares = shares[name].fairShares
      result[period][name].sumOfFairShares = shares[name].sumOfFairShares
      result[period][name].Anteil =
        shares[name].sumOfFairShares +
        ' / ' +
        totalSumFairShares +
        ' = ' +
        Math.round(10000 * shares[name].anteil) / 100 +
        '%'

      // if there is a yet new person, add it to output[0]
      result[0][name] = result[0][name] || ''
    }

    // this check should always sum up to whats there to be shared
    let checkSumAnteilePercent = 0
    let checkSumAnteile = 0
    for (const name in shares) {
      checkSumAnteilePercent += shares[name].anteil
      checkSumAnteile += shares[name].anteil
    }
    result[period].checks = {}
    result[period].checks.sumAnteilePercent = checkSumAnteilePercent
    result[period].checks.sumAnteile = checkSumAnteile
    result[period].checks.sharesInDistribution = sharesInDistribution
  }

  return result
}

export default fairshare
