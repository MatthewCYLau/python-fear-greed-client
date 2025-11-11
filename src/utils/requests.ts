import { ChartTypes } from '../types'

export const getRequestDetails = (
  chartType: ChartTypes,
  stockSymbol: string,
  currency: string
) => {
  let url = ''
  let title = ''
  switch (chartType) {
    case 'close':
      url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/generate-stock-plot?stocks=${stockSymbol}&rollingAverageDays=50`
      title = `${stockSymbol} Stock Plot`
      break
    case 'closeDailyReturn':
      url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/generate-stock-close-daily-return-plot`
      title = `${stockSymbol} Stock Close Daily Change Plot`
      break
    case 'dividends':
      url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/generate-stock-dividends-plot`
      title = `${stockSymbol} Dividends Plot`
      break
    case 'currencyImpact':
      url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/generate-currency-impact-plot`
      title = `${currency} Currency Impact on ${stockSymbol} Return Plot`
      break
  }

  return { url, title }
}
