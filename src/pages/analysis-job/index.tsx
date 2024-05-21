import {
  ReactElement,
  useState,
  ChangeEvent,
  useContext,
  useEffect
} from 'react'
import { v4 as uuid } from 'uuid'
import { Store } from '../../store'
import { AxiosResponse } from 'axios'
import { ActionType, AnalysisJob, AnalysisJobsResponse } from '../../types'
import { ActionType as AlertActionType } from '../../store/alert/action-types'
import NoItemsFoundCard from '../../components/no-item-found-card'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
import PaginationNavButton from '../../components/pagination-nav-button'
interface CreateAnalysisJobValues {
  stock: string
  targetFearGreedIndex: number
  targePeRatio: number
}

interface GetAnalysisJobValues {
  analysisJobId: string
}

const AnalysisJobPage = (): ReactElement => {
  const navigate = useNavigate()
  const { dispatch } = useContext(Store)
  const [createAnalysisJobformValues, setCreateAnalysisJobformValues] =
    useState<CreateAnalysisJobValues>({
      stock: '',
      targetFearGreedIndex: 0,
      targePeRatio: 0
    })
  const [getAnalysisJobformValues, setGetAnalysisJobformValues] =
    useState<GetAnalysisJobValues>({
      analysisJobId: ''
    })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(1)
  const [analysisJobs, setAnalysisJobs] = useState<AnalysisJob[]>([])
  const pageSize: number = 10

  const getAnalysisJobs = async () => {
    try {
      const { data }: AxiosResponse<AnalysisJobsResponse> = await api.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis-jobs?page=${currentPage}&pageSize=${pageSize}`
      )
      setAnalysisJobs(data.analysisJobs)
      setPageCount(data.paginationMetadata.totalPages)
    } catch (err) {
      console.log(err)
    }
  }

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
          stock: createAnalysisJobformValues.stock,
          targetFearGreedIndex:
            +createAnalysisJobformValues.targetFearGreedIndex,
          targePeRatio: +createAnalysisJobformValues.targePeRatio
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
            setGetAnalysisJobformValues({ analysisJobId: '' })
          }
        }
      })
    } catch (err) {
      console.log(err)
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: 'Get analysis job result failed!',
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
            navigate('/dashboard')
          }
        }
      })
    }
  }

  const handleOnNextPageClick = () => setCurrentPage(currentPage + 1)
  const handleOnPreviousPageClick = () => setCurrentPage(currentPage - 1)

  useEffect(() => {
    getAnalysisJobs()
  }, [])

  useEffect(() => {
    getAnalysisJobs()
  }, [currentPage])

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
            <label
              htmlFor="targetFearGreedIndex"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Target Fear & Greed Index
            </label>
            <input
              type="text"
              name="targetFearGreedIndex"
              id="targetFearGreedIndex"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createAnalysisJobformValues.targetFearGreedIndex}
              onChange={(e) => onCreateAnalysisJobFormChange(e)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="targePeRatio"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Target PE Ratio
            </label>
            <input
              type="text"
              name="targePeRatio"
              id="targePeRatio"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createAnalysisJobformValues.targePeRatio}
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
      <div className="m-7" id="alerts">
        <h1 className="font-bold py-4 uppercase">Analysis Jobs</h1>
        {!!analysisJobs.length ? (
          <>
            <table className="w-full whitespace-nowrap">
              <thead className="bg-black/60">
                <th className="text-left py-3 px-2 rounded-l-lg">Created</th>
                <th className="text-left py-3 px-2">Stock Symbol</th>
                <th className="text-left py-3 px-2">Fair Value</th>
                <th className="text-left py-3 px-2">Index Value</th>
              </thead>
              {analysisJobs.map((job) => (
                <tr key={job._id} className="border-b border-gray-700">
                  <td className="py-3 px-2 font-bold">
                    {new Date(Date.parse(job.created)).toLocaleString()}
                  </td>
                  <td className="py-3 px-2">{job.stock_symbol}</td>
                  <td className="py-3 px-2">{job.fair_value}</td>
                  <td className="py-3 px-2">
                    {job.most_recent_fear_greed_index}
                  </td>
                </tr>
              ))}
            </table>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <PaginationNavButton
                disabled={currentPage === 1}
                onClickHandler={() => setCurrentPage(1)}
                copy="<<"
              />
              <PaginationNavButton
                disabled={currentPage === 1}
                onClickHandler={handleOnPreviousPageClick}
                copy="<"
              />
              <div className="text-slate-500">{`${currentPage} / ${pageCount}`}</div>
              <PaginationNavButton
                disabled={currentPage === pageCount}
                onClickHandler={handleOnNextPageClick}
                copy=">"
              />
              <PaginationNavButton
                disabled={currentPage === pageCount}
                onClickHandler={() => setCurrentPage(pageCount)}
                copy=">>"
              />
            </div>
          </>
        ) : (
          <NoItemsFoundCard itemName="alert" />
        )}
      </div>
    </Layout>
  )
}

export default AnalysisJobPage
