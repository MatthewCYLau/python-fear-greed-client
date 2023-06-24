import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ReactElement, useContext } from 'react'
import { StoreProvider, Store } from './store'
import AuthWrapper from './components/auth-wrapper'
import Alert from './components/alert'
import HomePage from './pages/home'
import SignUpPage from './pages/sign-up'
import LoginPage from './pages/login'
import DashboardPage from './pages/dashboard'
import CreateAlertPage from './pages/create-alert'

type PrivateRouteProps = {
  component: React.ComponentType<any>
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component
}) => {
  const { state } = useContext(Store)
  if (state.isAuthenticated) return <Component />
  return <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: '/sign-up',
    element: <SignUpPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute component={DashboardPage} />
  },
  {
    path: '/create-alert',
    element: <PrivateRoute component={CreateAlertPage} />
  },
  {
    path: '/*',
    element: <HomePage />
  }
])

const App = (): ReactElement => {
  return (
    <div className="App">
      <StoreProvider>
        <AuthWrapper>
          <Alert />
          <RouterProvider router={router} />
        </AuthWrapper>
      </StoreProvider>
    </div>
  )
}

export default App
