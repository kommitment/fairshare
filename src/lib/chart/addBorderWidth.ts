import { curry, assoc, map } from 'ramda'

export default curry((width: number, datasets: {}[]) =>
  map((dataset) => assoc('borderWidth', width, dataset), datasets)
)
