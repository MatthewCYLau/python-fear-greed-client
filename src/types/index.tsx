export interface Token {
  token: string
}
export interface User {
  _id: string
  email: string
  name: string
  avatarImageUrl: string
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
  stock_symbol: string
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
