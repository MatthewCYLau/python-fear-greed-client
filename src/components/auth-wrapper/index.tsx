import {
  ReactChildren,
  ReactElement,
  ReactNode,
  useContext,
  useEffect
} from 'react'
import { AxiosResponse } from 'axios'
import setAuthToken from '../../utils/setAuthToken'
import { ActionType, User } from '../../types'
import api from '../../utils/api'

import { Store } from '../../store'

interface AuthWrapperProps {
  children: ReactChildren | ReactNode | ReactElement
}

const AuthWrapper = ({ children }: AuthWrapperProps): ReactElement => {
  const { dispatch, ...rest } = useContext(Store)

  const loadUser = async () => {
    try {
      const { data }: AxiosResponse<User> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth`
      )
      dispatch({
        type: ActionType.USER_LOADED,
        payload: data
      })
    } catch (err) {
      console.log('error!')
    }
  }

  const token = rest.state.token
  if (token) {
    setAuthToken(token)
  }

  useEffect(() => {
    loadUser()
  }, [token])

  return <>{children}</>
}

export default AuthWrapper
