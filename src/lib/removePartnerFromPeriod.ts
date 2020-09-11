import { differenceWith, eqBy, assoc, pipe } from 'ramda'

export default (partnerName: string) => (period: Period): Period =>
  pipe(
    (p: Period) => p.partners,
    (p: Partner[]) => excludePartner(partnerName)(p),
    (p: Partner[]) => assoc('partners', p, period)
  )(period)

const excludePartner = (partnerName: string) => (partners: Partner[]) =>
  differenceWith(equalByName, partners, [{ name: partnerName, work: 1 }])

const equalByName = eqBy((p: Partner) => p.name)
