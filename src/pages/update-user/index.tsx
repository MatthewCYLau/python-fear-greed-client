import {
  ReactElement,
  useState,
  ChangeEvent,
  useContext,
  useEffect
} from 'react'
import { Store } from '../../store'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { Currency, CurrencyValues } from '../../types'
import api from '../../utils/api'
import { formatAmountTwoDecimals } from '../../utils/string'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
import Dropdown from '../../components/dropdown'
interface Values {
  password: string
  regularContributionAmount: string
  currency: Currency
}

const currencies: Currency[] = [
  CurrencyValues.GBP,
  CurrencyValues.EUR,
  CurrencyValues.USD
]

const UpdateUserPage = (): ReactElement => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>(
    state.user.avatarImageUrl
  )
  const [formValues, setFormValues] = useState<Values>({
    password: '',
    regularContributionAmount: formatAmountTwoDecimals(
      state.user.regularContributionAmount.toString()
    ),
    currency: state.user.currency
  })
  const [file, setFile] = useState<File>()
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const dropdownItemOnClickHandler = (n: Currency) => {
    setFormValues({ ...formValues, currency: n })
  }

  const handleOnBlur = () => {
    setFormValues({
      ...formValues,
      regularContributionAmount: formatAmountTwoDecimals(
        formValues.regularContributionAmount
      )
    })
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
    currency: Currency
  } => {
    if (formValues.password) {
      return {
        name: state.user.name,
        email: state.user.email,
        password: formValues.password,
        avatarImageUrl: state.user.avatarImageUrl,
        regularContributionAmount: +formValues.regularContributionAmount,
        currency: formValues.currency
      }
    } else {
      return {
        name: state.user.name,
        email: state.user.email,
        avatarImageUrl: avatarImageUrl,
        regularContributionAmount: +formValues.regularContributionAmount,
        currency: formValues.currency
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
          regularContributionAmount: +formValues.regularContributionAmount,
          currency: formValues.currency
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
              onBlur={() => handleOnBlur()}
              onChange={(e) => onChange(e)}
            />
          </div>
          <Dropdown
            header="Currency"
            dropdownItems={currencies}
            value={formValues.currency}
            selectDropdownItem={dropdownItemOnClickHandler}
          />
          <div className="mb-6">
            <label
              htmlFor="balance"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Balance
            </label>
            <input
              type="number"
              name="balance"
              id="balance"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              readOnly
              value={state.user.balance}
            />
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
