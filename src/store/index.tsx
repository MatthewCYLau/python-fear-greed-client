import React from 'react'

type AppState = {
  isAuthenticated: boolean
}

const initialState: AppState = {
  isAuthenticated: false
}

type Action = { type: 'USER_SIGNIN'; payload: boolean }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, isAuthenticated: action.payload }
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
