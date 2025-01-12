import {
  ReactElement,
  useState,
  ChangeEvent,
  useContext,
  useEffect,
  useRef
} from 'react'
import cn from 'classnames'
import { Store } from '../../store'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { Currency, CurrencyValues } from '../../types'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
interface Values {
  password: string
  regularContributionAmount: number
}

const currencies: Currency[] = [CurrencyValues.GBP]

const UpdateUserPage = (): ReactElement => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>(
    state.user.avatarImageUrl
  )
  const [formValues, setFormValues] = useState<Values>({
    password: '',
    regularContributionAmount: state.user.regularContributionAmount
  })
  const [file, setFile] = useState<File>()
  const ref = useRef<HTMLDivElement>(null)
  const [currency, setCurrency] = useState<Currency>(CurrencyValues.GBP)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const dropdownItemOnClickHandler = (n: Currency) => {
    setCurrency(n)
    setShowDropdown(!showDropdown)
  }

  const uploadFile = async () => {
    const formData = new FormData()
    if (file) {
      formData.append('file', file)
      const { data } = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      setAvatarImageUrl(data.asset_url)
    }
  }

  const evaluatePayload = (): {
    name: string
    email: string
    password?: string
    avatarImageUrl: string
    regularContributionAmount: number
  } => {
    if (formValues.password) {
      return {
        name: state.user.name,
        email: state.user.email,
        password: formValues.password,
        avatarImageUrl: state.user.avatarImageUrl,
        regularContributionAmount: +formValues.regularContributionAmount
      }
    } else {
      return {
        name: state.user.name,
        email: state.user.email,
        avatarImageUrl: avatarImageUrl,
        regularContributionAmount: +formValues.regularContributionAmount
      }
    }
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${state.user._id}`,
        evaluatePayload(),
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      dispatch({
        type: AuthActionType.USER_UPDATED,
        payload: {
          avatarImageUrl,
          regularContributionAmount: +formValues.regularContributionAmount
        }
      })
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    uploadFile()
  }, [file])

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Update User</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="index"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="regularContributionAmount"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Regular contribution amount
            </label>
            <input
              type="number"
              name="regularContributionAmount"
              id="regularContributionAmount"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.regularContributionAmount}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="relative group mb-6">
            <label
              htmlFor="regularContributionAmount"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Currency
            </label>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
              className="inline-flex justify-center w-full px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
            >
              <span className="mr-2">{currency}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn('w-5 h-5 ml-2 -mr-1', {
                  'rotate-180': showDropdown
                })}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showDropdown && (
              <div
                ref={ref}
                id="dropdown-menu"
                className="absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 z-2"
              >
                {currencies.map((n) => (
                  <button
                    key={n}
                    onClick={() => dropdownItemOnClickHandler(n)}
                    className="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              htmlFor="file_input"
            >
              Upload image
            </label>
            <input
              className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <button
              disabled={
                !avatarImageUrl &&
                !formValues.password &&
                !formValues.regularContributionAmount
              }
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default UpdateUserPage
