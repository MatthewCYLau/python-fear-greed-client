import { ReactElement, useState, ChangeEvent, useEffect } from 'react'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import { Alert } from '../../types'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout'
import Loader from '../../components/loader'
interface Values {
  index: number
  note: string
}

const EditAlertPage = (): ReactElement => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<Values>({
    index: 0,
    note: ''
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.SyntheticEvent, id: string) => {
    e.preventDefault()
    try {
      await api.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts/${id}`,
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

  const getAlertById = async (id: string) => {
    setIsLoading(true)
    try {
      const { data }: AxiosResponse<Alert> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts/${id}`
      )
      setFormValues({ index: data.index, note: data.note })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    id && getAlertById(id)
  }, [])

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="m-7 w-1/2">
            <h1 className="font-bold py-4 uppercase">Update Alert</h1>
            <form onSubmit={(e) => id && submitHandler(e, id)}>
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
                  Update Alert
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Layout>
  )
}

export default EditAlertPage
