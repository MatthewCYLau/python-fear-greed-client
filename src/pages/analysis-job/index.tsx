import { ReactElement, useState, ChangeEvent, useContext } from 'react'
import { Store } from '../../store'
import { ActionType } from '../../types'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
interface CreateAnalysisJobValues {
  stock: string
}

interface GetAnalysisJobValues {
  analysisJobId: string
}

const AnalysisJobPage = (): ReactElement => {
  const navigate = useNavigate()
  const { dispatch } = useContext(Store)
  const [createAnalysisJobformValues, setCreateAnalysisJobformValues] =
    useState<CreateAnalysisJobValues>({
      stock: ''
    })
  const [getAnalysisJobformValues, setGetAnalysisJobformValues] =
    useState<GetAnalysisJobValues>({
      analysisJobId: ''
    })

  const onCreateAnalysisJobFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateAnalysisJobformValues({
      ...createAnalysisJobformValues,
      [e.target.name]: e.target.value
    })
  }

  const onGetAnalysisJobFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGetAnalysisJobformValues({
      ...getAnalysisJobformValues,
      [e.target.name]: e.target.value
    })
  }

  const createAnalysisJobSubmitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const res = await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis-jobs`,
        {
          stock: createAnalysisJobformValues.stock
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: `Analysis job ID: ${res.data.analysisJobId}`,
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
            navigate('/dashboard')
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const getAnalysisJobSubmitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis-jobs/${
          getAnalysisJobformValues.analysisJobId
        }`
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: `Fair value for stock ${res.data.stock_symbol} is: ${res.data.fair_value}`,
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
            navigate('/dashboard')
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Create Analysis Job</h1>
        <form onSubmit={createAnalysisJobSubmitHandler}>
          <div className="mb-6">
            <label
              htmlFor="index"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Stock Symbol
            </label>
            <input
              type="text"
              name="stock"
              id="stock"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createAnalysisJobformValues.stock}
              onChange={(e) => onCreateAnalysisJobFormChange(e)}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Create Analysis Job
            </button>
          </div>
        </form>
        <h1 className="font-bold py-4 uppercase">Get Analysis Job</h1>
        <form onSubmit={getAnalysisJobSubmitHandler}>
          <div className="mb-6">
            <label
              htmlFor="index"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Analysis Job ID
            </label>
            <input
              type="text"
              name="analysisJobId"
              id="analysisJobId"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={getAnalysisJobformValues.analysisJobId}
              onChange={(e) => onGetAnalysisJobFormChange(e)}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Get Analysis Job
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AnalysisJobPage
