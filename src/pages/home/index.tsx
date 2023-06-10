import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <div className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 py-16 pt-28 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Python Fear and Greed Index Notification
          </h1>

          <p className="mt-6 text-gray-500 dark:text-gray-300">
            Receive notification on investor sentiment
          </p>

          <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-center">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center order-1 w-full px-2 py-2 mt-3 text-sm tracking-wide text-gray-600 capitalize transition-colors duration-300 transform border rounded-md sm:mx-2 dark:border-gray-400 dark:text-gray-300 sm:mt-0 sm:w-40 hover:bg-gray-50 focus:outline-none focus:ring dark:hover:bg-gray-800 focus:ring-gray-300 focus:ring-opacity-40"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/sign-up')}
              className="w-full px-5 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-md sm:mx-2 sm:order-2 sm:w-40 hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80"
            >
              Sign Up!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
