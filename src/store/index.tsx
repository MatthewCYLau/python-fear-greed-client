import React from 'react'
import { User, Token, ActionType, AppAlert } from '../types'

export type AppState = {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  alerts: AppAlert[]
  user:
    | User
    | {
        email: ''
        name: ''
      }
}

const initialState: AppState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  alerts: [
    // {
    //   id: '',
    //   message: 'foo',
    //   severity: 'error'
    // }
  ],
  user: {
    email: '',
    name: ''
  }
}

type Action =
  | { type: ActionType.LOGIN_SUCCESS; payload: Token }
  | { type: ActionType.USER_LOADED; payload: User }
  | { type: ActionType.REGISTRATION_SUCCESS; payload: Token }
  | { type: ActionType.LOGOUT; payload: Token }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      }
    case ActionType.LOGIN_SUCCESS:
    case ActionType.REGISTRATION_SUCCESS:
      return { ...state, token: action.payload.token, isAuthenticated: true }
    case ActionType.LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: {
          email: '',
          name: ''
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
