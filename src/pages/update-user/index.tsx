import { ReactElement, useState, ChangeEvent, useContext } from 'react'
import { Store } from '../../store'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
interface Values {
  password: string
}

const UpdateUserPage = (): ReactElement => {
  const navigate = useNavigate()
  const { state } = useContext(Store)
  const [formValues, setFormValues] = useState<Values>({
    password: ''
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${state.user._id}`,
        {
          name: state.user.name,
          email: state.user.email,
          password: formValues.password
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Update Password</h1>
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
            <button
              type="submit"
              className="mb-4 w-1/3 px-3 py-2 text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            >
              Upload image
            </button>
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default UpdateUserPage
