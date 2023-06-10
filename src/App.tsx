import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/home'
import SignUpPage from './pages/sign-up'
import LoginPage from './pages/login'

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
    path: '/*',
    element: <HomePage />
  }
])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
