import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactElement } from 'react'
import { StoreProvider } from './store'
import AuthWrapper from './components/auth-wrapper'
import Alert from './components/alert'
import HomePage from './pages/home'
import SignUpPage from './pages/sign-up'
import LoginPage from './pages/login'
import DashboardPage from './pages/dashboard'
import CreateAlertPage from './pages/create-alert'

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
    element: <DashboardPage />
  },
  {
    path: '/create-alert',
    element: <CreateAlertPage />
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
