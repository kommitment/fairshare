import { curry, zipWith, assoc } from 'ramda'

export default curry((colors: string[], datasets: {}[]) =>
  zipWith(
    (color, dataset) => assoc('backgroundColor', color, dataset),
    colors,
    datasets
  )
)
