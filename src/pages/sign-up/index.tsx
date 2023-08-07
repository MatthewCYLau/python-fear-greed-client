import {
  ReactElement,
  useState,
  useContext,
  ChangeEvent,
  useEffect
} from 'react'
import { v4 as uuid } from 'uuid'
import axios, { AxiosResponse } from 'axios'
import { Store } from '../../store'
import { Token, ActionType } from '../../types'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { Link, useNavigate } from 'react-router-dom'

interface Values {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

const SignUpPage = (): ReactElement => {
  const navigate = useNavigate()
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true)
  const [formValues, setFormValues] = useState<Values>({
    email: '',
    name: '',
    password: '',
    passwordConfirm: ''
  })
  const { state, dispatch } = useContext(Store)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const { data }: AxiosResponse<Token> = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        {
          email: formValues.email,
          name: formValues.name,
          password: formValues.password
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      dispatch({ type: AuthActionType.REGISTRATION_SUCCESS, payload: data })
    } catch (err: any) {
      const errors: Error[] = err.response.data.errors
      errors.forEach((e) =>
        dispatch({
          type: ActionType.SET_ALERT,
          payload: { id: uuid(), message: e.message, severity: 'error' }
        })
      )
    }
  }

  useEffect(
    () => setDisableSubmit(formValues.password !== formValues.passwordConfirm),
    [formValues.passwordConfirm, formValues.password]
  )

  if (state.isAuthenticated) {
    navigate('/dashboard')
  }
  return (
    <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
              Sign up
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign up to create your account
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
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Jon Doe"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
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
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password-confirm"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Confirm password
                  </label>
                </div>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="password-confirm"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <button
                  disabled={disableSubmit}
                  type="submit"
                  className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                >
                  Sign up
                </button>
              </div>
              <p className="text-sm text-center text-gray-400">
                Return{' '}
                <Link
                  className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                  to="/"
                >
                  home
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

export default SignUpPage
