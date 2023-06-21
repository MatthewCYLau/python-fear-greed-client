export interface Token {
  token: string
}
export interface User {
  user_id: string
  email: string
  name: string
  time_created: string
}

export interface Alert {
  id: string
  message: string
  severity: 'error' | 'info'
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
  TRIGGER_VERIFICATION_FAILED = 'trigger_verification_failed'
}
