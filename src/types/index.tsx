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
  SET_ALERT = 'set_alert',
  REMOVE_ALERT = 'remove_alert',
  SET_MODAL = 'set_modal',
  REMOVE_MODAL = 'remove_modal'
}
