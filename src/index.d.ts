interface Partner {
  name: string
  work: number
  returnedFairShares?: number
  foundersShare?: number
  accumWork?: number
  shares?: number
}

interface Period {
  name: string
  sumWork?: number
  accumWork?: number
  sharesInDistribution?: number
  partners: Partner[]
}
