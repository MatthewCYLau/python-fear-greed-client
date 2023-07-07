import { RouterProvider } from 'react-router-dom'
import { ReactElement } from 'react'
import { StoreProvider } from './store'
import AuthWrapper from './components/auth-wrapper'
import { router } from './routes'
import Alert from './components/alert'
import Modal from './components/modal'

const App = (): ReactElement => {
  return (
    <div className="App">
      <StoreProvider>
        <AuthWrapper>
          <Alert />
          <Modal />
          <RouterProvider router={router} />
        </AuthWrapper>
      </StoreProvider>
    </div>
  )
}

export default App
