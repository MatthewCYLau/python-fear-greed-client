import data from '../resource/data.json'

export const years: number[] = [1, 2, 3]
const commonStockSymbolsList: string[] = [
  'AAPL',
  'TSLA',
  'META',
  'JPM',
  'GOOG',
  'AMZN'
]

export const commonStockSymbols: string[] = [
  ...data.indices,
  ...commonStockSymbolsList
].sort((a, b) => a.localeCompare(b))
