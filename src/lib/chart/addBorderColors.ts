import { curry, zipWith, assoc } from 'ramda'

export default curry((colors: string[], datasets: {}[]) =>
  zipWith(
    (color, dataset) => assoc('borderColor', color, dataset),
    colors,
    datasets
  )
)
