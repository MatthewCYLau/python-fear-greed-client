import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactElement } from 'react'
import { StoreProvider } from './store'
import AuthWrapper from './components/auth-wrapper'
import HomePage from './pages/home'
import SignUpPage from './pages/sign-up'
import LoginPage from './pages/login'
import DashboardPage from './pages/dashboard'

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
    path: '/*',
    element: <HomePage />
  }
])

const App = (): ReactElement => {
  return (
    <div className="App">
      <StoreProvider>
        <AuthWrapper>
          <RouterProvider router={router} />
        </AuthWrapper>
      </StoreProvider>
    </div>
  )
}

export default App
