import { ReactElement, useState, useContext, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { Store } from '../../store'
import { Token } from '../../types'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { ActionType as AlertActionType } from '../../store/alert/action-types'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'

interface Values {
  email: string
  password: string
}

const LoginPage = (): ReactElement => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<Values>({
    email: '',
    password: ''
  })
  const { state, dispatch } = useContext(Store)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const responseMessage = (response: CredentialResponse) => {
    console.log(response)
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const { data }: AxiosResponse<Token> = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth`,
        formValues,
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      dispatch({ type: AuthActionType.LOGIN_SUCCESS, payload: data })
    } catch (err: any) {
      const errors: Error[] = err.response.data.errors
      errors.forEach((e) =>
        dispatch({
          type: AlertActionType.SET_ALERT,
          payload: { id: uuid(), message: e.message, severity: 'error' }
        })
      )
    }
  }

  if (state.isAuthenticated) {
    navigate('/dashboard')
  }
  return (
    <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
              Login
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Login to access your account
            </p>
          </div>
          <div className="m-7">
            <form onSubmit={submitHandler}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  value={formValues.email}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Password
                  </label>
                  <a
                    href="#!"
                    className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  value={formValues.password}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                >
                  Login
                </button>
              </div>
              <GoogleLogin onSuccess={responseMessage} />
              <p className="text-sm text-center text-gray-400 mt-4">
                Don&#x27;t have an account yet?{' '}
                <Link
                  className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                  to="/sign-up"
                >
                  Sign up
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
