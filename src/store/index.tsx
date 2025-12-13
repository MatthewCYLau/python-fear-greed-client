import React, { ReactNode } from 'react'
import { Actions as AuthActions } from './auth/actions'
import { ActionType as AuthActionType } from './auth/action-types'
import { Actions as AlertActions } from './alert/actions'
import { ActionType as AlertActionType } from './alert/action-types'
import { User, ActionType, AppAlert, CurrencyValues } from '../types'

export type AppState = {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  modal: {
    showModal: boolean
    message: string
    children?: ReactNode
    onConfirm?: () => void
    onCancel?: () => void
    onCopyClick?: () => void
  }
  alerts: AppAlert[]
  user:
    | User
    | {
        _id: ''
        email: ''
        name: ''
        avatarImageUrl: ''
        regularContributionAmount: 0
        currency: CurrencyValues.GBP
        balance: 0
        portfolio: []
      }
}

const initialState: AppState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  modal: {
    showModal: false,
    message: ''
  },
  alerts: [],
  user: {
    _id: '',
    email: '',
    name: '',
    avatarImageUrl: '',
    regularContributionAmount: 0,
    currency: CurrencyValues.GBP,
    balance: 0,
    portfolio: []
  }
}

type Action =
  | {
      type: ActionType.SET_MODAL
      payload: {
        message: string
        children?: ReactNode
        onConfirm: () => void
        onCancel?: () => void
        onCopyClick?: () => void
      }
    }
  | {
      type: ActionType.REMOVE_MODAL
    }
  | AuthActions
  | AlertActions

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case AuthActionType.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      }
    case AuthActionType.USER_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          avatarImageUrl: action.payload.avatarImageUrl,
          regularContributionAmount: action.payload.regularContributionAmount,
          currency: action.payload.currency
        }
      }
    case AuthActionType.LOGIN_SUCCESS:
    case AuthActionType.REGISTRATION_SUCCESS:
      return { ...state, token: action.payload.token, isAuthenticated: true }
    case AuthActionType.LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {
          _id: '',
          email: '',
          name: '',
          avatarImageUrl: '',
          regularContributionAmount: 0,
          currency: CurrencyValues.GBP,
          balance: 0,
          portfolio: []
        }
      }
    case AlertActionType.SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      }
    case AlertActionType.REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload)
      }
    case ActionType.SET_MODAL:
      return {
        ...state,
        modal: {
          showModal: true,
          message: action.payload.message,
          children: action.payload.children,
          onCancel: action.payload.onCancel,
          onConfirm: action.payload.onConfirm,
          onCopyClick: action.payload.onCopyClick
        }
      }
    case ActionType.REMOVE_MODAL:
      return {
        ...state,
        modal: {
          showModal: false,
          message: ''
        }
      }
    default:
      return state
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch
})

function StoreProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  )

  return <Store.Provider value={{ state, dispatch }} {...props} />
}

export { Store, StoreProvider }
