import {
  pipe,
  assoc,
  reduce,
  map,
  pluck,
  find,
  propEq,
  defaultTo,
  mapObjIndexed,
  values,
} from 'ramda'
import extractPartnerNames from '../extractPartnerNames'

const getSeries = (field: string) => (periods: Period[]) => (
  partnerName: string
): number[] =>
  pipe(
    () => pluck('partners', periods),
    map(find(propEq('name', partnerName))),
    map(defaultTo({})),
    pluck(field),
    map(defaultTo(0)),
    (x: any): number[] => x as number[]
  )()

const getSeriesForPartners = (getSeries: (partnerName: string) => number[]) => (
  partnerNames: string[]
) =>
  reduce(
    (acc: Record<string, number[]>, partnerName: string) =>
      assoc(partnerName, getSeries(partnerName), acc),
    {},
    partnerNames
  )

export const getPartnerToSeriesRecords = (field: string, periods: Period[]) =>
  pipe(
    extractPartnerNames,
    //
    getSeriesForPartners(getSeries(field)(periods))
  )(periods)

export default (field: string, periods: Period[]) =>
  pipe(
    () => getPartnerToSeriesRecords(field, periods),
    mapObjIndexed((data, label) => ({ label, data })),
    values
  )()
