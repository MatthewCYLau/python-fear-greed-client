import { ReactChildren, ReactElement, ReactNode, useContext } from 'react'
import setAuthToken from '../../utils/setAuthToken'
import { Store } from '../../store'

interface WrapperProps {
  children: ReactChildren | ReactNode | ReactElement
}

const Wrapper = ({ children }: WrapperProps): ReactElement => {
  const { dispatch, ...rest } = useContext(Store)

  const token = rest.state.token
  if (token) {
    setAuthToken(token)
  }

  return <>{children}</>
}

export default Wrapper
