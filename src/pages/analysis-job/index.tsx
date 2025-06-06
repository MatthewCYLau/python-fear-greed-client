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
import DeleteIcon from '../../components/icons/delete-icon'
import NoItemsFoundCard from '../../components/no-item-found-card'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout'
import { commonStockSymbols } from '../../constants'
import PaginationNavButton from '../../components/pagination-nav-button'
import AnalysisJobInfo from '../../components/analysis-job-info'
import Pill from '../../components/pill'
import PlotChartIcon from '../../components/icons/plot-chart-icon'
import Loader from '../../components/loader'
import StockPicker from '../../components/search-dropdown'

interface CreateAnalysisJobValues {
  stock: string
  targetFearGreedIndex: number
  targetPeRatio: number
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
      targetPeRatio: 0
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

  const deleteAnalyaiaJobById = async (id: string) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis-jobs/${id}`
      )
      getAnalysisJobs()
    } catch (err) {
      console.log(err)
    }
  }

  const handleOnDelete = (id: string) => {
    const onConfirm = () => {
      dispatch({ type: ActionType.REMOVE_MODAL })
      deleteAnalyaiaJobById(id)
    }
    dispatch({
      type: ActionType.SET_MODAL,
      payload: {
        message: `Do you want to delete analysis job?`,
        onCancel: () => dispatch({ type: ActionType.REMOVE_MODAL }),
        onConfirm
      }
    })
  }

  const plotStockChart = async (stockSymbol: string, targetPrice: number) => {
    dispatch({
      type: ActionType.SET_MODAL,
      payload: {
        message: 'Plot Data',
        children: (
          <div className="h-60 w-60">
            <Loader />
          </div>
        ),
        onConfirm: () => {
          dispatch({ type: ActionType.REMOVE_MODAL })
        }
      }
    })
    try {
      const res = await api.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/generate-stock-plot?stocks=${stockSymbol}&targetPrice=${targetPrice}`
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: `${stockSymbol} Stock Plot`,
          children: (
            <a
              href={res.data.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={res.data.image_url} alt={`${stockSymbol} Stock Plot`} />
            </a>
          ),
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
          }
        }
      })
    } catch (error: any) {
      const errors: Error[] = error.response.data.errors
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: `Something went wrong! ${errors[0].message}`,
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
          }
        }
      })
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
          targetPeRatio: +createAnalysisJobformValues.targetPeRatio
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
          },
          onCopyClick: () => {
            navigator.clipboard.writeText(res.data.analysisJobId)
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
          message: `Fair value for stock ${res.data.stock_symbol} is: ${res.data.fair_value}; one-year price prediction is ${res.data.price_prediction}`,
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
          <StockPicker
            header="Stock Symbol"
            onBlurHandler={() =>
              setCreateAnalysisJobformValues({
                ...createAnalysisJobformValues,
                stock: createAnalysisJobformValues.stock.toUpperCase()
              })
            }
            value={createAnalysisJobformValues.stock}
            onChangeHandler={(e) =>
              setCreateAnalysisJobformValues({
                ...createAnalysisJobformValues,
                stock: e.target.value
              })
            }
            dropdownItems={commonStockSymbols}
            selectDropdownItem={(n: string) =>
              setCreateAnalysisJobformValues({
                ...createAnalysisJobformValues,
                stock: n
              })
            }
            placeholder="AAPL"
          />
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
              htmlFor="targetPeRatio"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Target PE Ratio
            </label>
            <input
              type="text"
              name="targetPeRatio"
              id="targetPeRatio"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createAnalysisJobformValues.targetPeRatio}
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
                <tr>
                  <th className="text-left py-3 px-2 rounded-l-lg">Created</th>
                  <th className="text-left py-3 px-2">Stock Symbol</th>
                  <th className="text-left py-3 px-2">Fair Value</th>
                  <th className="text-left py-3 px-2">Delta</th>
                  <th className="text-left py-3 px-2">Price Prediction</th>
                  <th className="text-left py-3 px-2 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              {analysisJobs.map((job) => (
                <tbody key={job._id}>
                  <tr key={job._id} className="border-b border-gray-700">
                    <td className="py-3 px-2 font-bold">
                      {new Date(Date.parse(job.created)).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">{job.stock_symbol}</td>
                    <td className="py-3 px-2">{job.fair_value}</td>
                    <td className="py-3 px-2">
                      <Pill delta={job.delta} />
                    </td>
                    <td className="py-3 px-2">{job.price_prediction}</td>
                    <td className="py-3 px-2">
                      <div className="inline-flex items-center space-x-3">
                        <button
                          onClick={() => handleOnDelete(job._id)}
                          className="hover:text-white"
                        >
                          <DeleteIcon />
                        </button>
                        <AnalysisJobInfo
                          targetPeRatio={job.target_pe_ratio || 0}
                          targetFearGreedIndex={
                            job.target_fear_greed_index || 0
                          }
                        />
                        <button
                          onClick={() =>
                            plotStockChart(job.stock_symbol, job.fair_value)
                          }
                          className="hover:text-white"
                        >
                          <PlotChartIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
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
          <NoItemsFoundCard itemName="analysis job" />
        )}
      </div>
    </Layout>
  )
}

export default AnalysisJobPage
