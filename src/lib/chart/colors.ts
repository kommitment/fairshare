import { map } from 'ramda'
import Color from 'color'

const colors = [
  '#8328B8',
  '#63834B',
  '#FA5505',
  '#9B9B9B',
  '#0B9CF3',
  '#F02B47',
  '#3C4CBA',
  '#8CC443',
  '#04948A',
  '#04BCD4',
  '#F8D810',
  '#FC9B04',
  '#627C8C',
  '#CCDC24',
  '#9C9CA4',
  '#DC1474',
  '#1CA464',
  '#A41CAC',
  '#7CBC44',
  '#3C54BC',
]

export const getBackgroundColors = () =>
  map((color: string) => Color(color).alpha(0.2).rgb().string(), colors)

export const getBorderColors = () =>
  map((color: string) => Color(color).rgb().string(), colors)
