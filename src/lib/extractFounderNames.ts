import { pipe, uniq, pluck, head, defaultTo, prop } from 'ramda'

export default (periods: Period[]): string[] =>
  pipe(
    head,
    (p: Period): Period | { partners: [] } => defaultTo({ partners: [] }, p),
    prop('partners'),
    defaultTo([]),
    pluck('name'),
    uniq
  )(periods)
