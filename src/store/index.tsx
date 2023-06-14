import React from 'react'
import { User, Token, ActionType } from '../types'

type AppState = {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  user: User | null
}

const initialState: AppState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null
}

type Action = { type: ActionType.LOGIN_SUCCESS; payload: Token }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true }
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
