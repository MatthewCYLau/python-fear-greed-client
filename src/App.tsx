import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StoreProvider } from './store'
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

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </div>
  )
}

export default App
