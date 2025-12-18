export interface Token {
  token: string
}

export interface PortfolioData {
  stock_symbol: string
  quantity: number
}

export interface User {
  _id: string
  email: string
  name: string
  avatarImageUrl: string
  regularContributionAmount: number
  currency: Currency
  balance: number
  portfolio: PortfolioData[]
}

export interface AppAlert {
  id: string
  message: string
  severity: 'error' | 'info'
}

export interface Alert {
  _id: string
  created: string
  index: number
  note: string
  have_actioned: boolean
}

export interface Event {
  _id: string
  created: string
  index: number
}

export enum ActionType {
  SET_MODAL = 'set_modal',
  REMOVE_MODAL = 'remove_modal'
}

export interface AnalysisJob {
  _id: string
  created: string
  fair_value: number
  delta: number
  most_recent_fear_greed_index: number
  current_pe_ratio?: number
  target_fear_greed_index?: number
  target_pe_ratio?: number
  stock_symbol: string
  price_prediction: number
}

export interface PaginationMeta {
  totalRecords: number
  currentPage: number
  totalPages: number
}

export interface AnalysisJobsResponse {
  paginationMetadata: PaginationMeta
  analysisJobs: AnalysisJob[]
}

export interface Order {
  _id: string
  created: string
  created_by: string
  last_modified: string
  order_type: string
  price: number
  quantity: number
  status: string
  stock_symbol: string
}

export interface OrdersResponse {
  paginationMetadata: PaginationMeta
  data: Order[]
}

export type Domain = 'event' | 'alert'

export enum ChartTypeValues {
  SCATTER = 'scatter',
  HISTOGRAM = 'histogram',
  PIE = 'pie',
  BAR = 'bar'
}

export type ChartType =
  | ChartTypeValues.SCATTER
  | ChartTypeValues.HISTOGRAM
  | ChartTypeValues.PIE
  | ChartTypeValues.BAR

export enum CurrencyValues {
  GBP = 'GBP',
  EUR = 'EUR',
  USD = 'USD'
}

export type Currency =
  | CurrencyValues.GBP
  | CurrencyValues.EUR
  | CurrencyValues.USD

export interface IndexAnalysisResponse {
  open: number
  previousClose: number
}

export interface StockData {
  close: number
  date: string
  'Daily change percentage': number
}

export interface MonthlyAverageClose {
  date: string
  'Monthly Average': string
}

export type ChartTypes =
  | 'close'
  | 'closeDailyReturn'
  | 'dividends'
  | 'currencyImpact'
