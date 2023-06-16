import { ReactChildren, ReactElement, ReactNode, useContext } from 'react'
import setAuthToken from '../../utils/setAuthToken'
import { Store } from '../../store'

interface AuthWrapperProps {
  children: ReactChildren | ReactNode | ReactElement
}

const AuthWrapper = ({ children }: AuthWrapperProps): ReactElement => {
  const { dispatch, ...rest } = useContext(Store)

  const token = rest.state.token
  if (token) {
    setAuthToken(token)
  }

  return <>{children}</>
}

export default AuthWrapper
