import React from 'react'
import { Actions as AuthActions } from './auth/actions'
import { ActionType as AuthActionType } from './auth/action-types'
import { User, ActionType, AppAlert } from '../types'

export type AppState = {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  modal: {
    showModal: boolean
    message: string
    onConfirm?: () => void
    onCancel?: () => void
  }
  alerts: AppAlert[]
  user:
    | User
    | {
        _id: ''
        email: ''
        name: ''
        avatarImageUrl: ''
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
    avatarImageUrl: ''
  }
}

type Action =
  | {
      type: ActionType.SET_ALERT
      payload: {
        id: string
        message: string
        severity: 'error' | 'info'
      }
    }
  | {
      type: ActionType.REMOVE_ALERT
      payload: string
    }
  | {
      type: ActionType.SET_MODAL
      payload: {
        message: string
        onConfirm: () => void
        onCancel: () => void
      }
    }
  | {
      type: ActionType.REMOVE_MODAL
    }
  | AuthActions

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case AuthActionType.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      }
    case AuthActionType.USER_AVATAR_IMAGE_URL_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          avatarImageUrl: action.payload
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
          avatarImageUrl: ''
        }
      }
    case ActionType.SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      }
    case ActionType.REMOVE_ALERT:
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
          onCancel: action.payload.onCancel,
          onConfirm: action.payload.onConfirm
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
