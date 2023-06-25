import { ReactElement, useState, ChangeEvent } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
interface Values {
  index: number
  note: string
}

const CreateAlertPage = (): ReactElement => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<Values>({
    index: 0,
    note: ''
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts`,
        {
          index: +formValues.index,
          note: formValues.note
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
        <h1 className="font-bold py-4 uppercase">Create Alert</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="index"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Index
            </label>
            <input
              type="text"
              name="index"
              id="index"
              placeholder="50"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.index}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label
                htmlFor="note"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Note
              </label>
            </div>
            <input
              type="text"
              name="note"
              id="note"
              placeholder="Add a custom note"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.note}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
            >
              Create Alert
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default CreateAlertPage
