export interface Token {
  token: string
}
export interface User {
  _id: string
  email: string
  name: string
  time_created: string
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
  USER_LOADED = 'user_loaded',
  AUTH_ERROR = 'auth_error',
  REGISTRATION_SUCCESS = 'registration_success',
  REGISTRATION_FAILED = 'registration_failed',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  VERIFY_EMAIL_SUCCESS = 'verify_email_success',
  VERIFY_EMAIL_FAILED = 'verify_email_failed',
  TRIGGER_VERIFICATION_SUCCESS = 'trigger_verification_success',
  TRIGGER_VERIFICATION_FAILED = 'trigger_verification_failed',
  SET_ALERT = 'set_alert',
  REMOVE_ALERT = 'remove_alert',
  SET_MODAL = 'set_modal',
  REMOVE_MODAL = 'remove_modal'
}
