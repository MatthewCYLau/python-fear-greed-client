import { ActionType } from '../action-types'
import { User, Token } from '../../../types'

interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS
  payload: Token
}

interface UserLoadedAction {
  type: ActionType.USER_LOADED
  payload: User
}

interface UserUpdatedAction {
  type: ActionType.USER_UPDATED
  payload: {
    avatarImageUrl: string
    regularContributionAmount: number
  }
}

interface RegistrationSuccessAction {
  type: ActionType.REGISTRATION_SUCCESS
  payload: Token
}

interface LogoutAction {
  type: ActionType.LOGOUT
}
export type Actions =
  | UserLoadedAction
  | UserUpdatedAction
  | RegistrationSuccessAction
  | LoginSuccessAction
  | LogoutAction
