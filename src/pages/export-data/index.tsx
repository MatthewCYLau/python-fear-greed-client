import { ReactElement, useState, useContext, useRef, useEffect } from 'react'
import { ActionType, ChartType, ChartTypeValues } from '../../types'
import { Store } from '../../store'
import DatePicker from 'react-datepicker'
import api from '../../utils/api'
import cn from 'classnames'
import { convertDateToValidFormet } from '../../utils/date'
import { capitaliseFirstLetter } from '../../utils/string'
import Layout from '../../components/layout'

import 'react-datepicker/dist/react-datepicker.css'
import Loader from '../../components/loader'

const chartTypes: ChartType[] = [
  ChartTypeValues.SCATTER,
  ChartTypeValues.HISTOGRAM
]

const ExportDataPage = (): ReactElement => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [chartType, setChartType] = useState<ChartType>(ChartTypeValues.SCATTER)
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { dispatch } = useContext(Store)
  const ref = useRef<HTMLDivElement>(null)

  const dropdownItemOnClickHandler = (n: ChartType) => {
    setChartType(n)
    setShowDropdown(!showDropdown)
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

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api
        .post(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/records/export-csv?startDate=${convertDateToValidFormet(
            fromDate
          )}&endDate=${convertDateToValidFormet(toDate)}`,
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          const fileName = `${new Date().toLocaleDateString()}.csv`
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
    } catch (err) {
      console.log(err)
    }
  }

  const handlePlotDataOnClick = async (): Promise<void> => {
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
        }/api/records/generate-plot?startDate=${convertDateToValidFormet(
          fromDate
        )}&endDate=${convertDateToValidFormet(toDate)}`
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: 'Plot Data',
          children: (
            <a
              href={res.data.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={res.data.image_url} alt="Plot data" />
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

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Export Data</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="index"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              From date
            </label>
            <DatePicker
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              selected={fromDate}
              onChange={(date) => date && setFromDate(date)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              htmlFor="file_input"
            >
              To date
            </label>
            <DatePicker
              className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              selected={toDate}
              onChange={(date) => date && setToDate(date)}
            />
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Export Data
            </button>
          </div>
          <div className="relative group mb-6">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
              className="inline-flex justify-center w-full px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
            >
              <span className="mr-2">{capitaliseFirstLetter(chartType)}</span>
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
                className="absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1"
              >
                {chartTypes.map((n) => (
                  <button
                    key={n}
                    onClick={() => dropdownItemOnClickHandler(n)}
                    className="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
                  >
                    {capitaliseFirstLetter(n)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handlePlotDataOnClick()}
            className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none disabled:opacity-75"
          >
            Plot Data
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default ExportDataPage
