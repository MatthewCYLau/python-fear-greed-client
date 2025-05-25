import data from '../resource/data.json'

export const years: number[] = [1, 2, 3]
export const commonStockSymbols: string[] = [
  'AAPL',
  'TSLA',
  'META',
  'JPM',
  'GOOG',
  'AMZN'
].sort((a, b) => a.localeCompare(b))

export const commonStockSymbolsAndIndices: string[] = [
  ...data.indices,
  ...commonStockSymbols
].sort((a, b) => a.localeCompare(b))
