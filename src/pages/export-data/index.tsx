import { ReactElement, useState, useContext } from 'react'
import { ActionType } from '../../types'
import { Store } from '../../store'
import DatePicker from 'react-datepicker'
import api from '../../utils/api'
import { convertDateToValidFormet } from '../../utils/date'
import Layout from '../../components/layout'

import 'react-datepicker/dist/react-datepicker.css'
import Loader from '../../components/loader'

const ExportDataPage = (): ReactElement => {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const { dispatch } = useContext(Store)

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
          children: <img src={res.data.image_url} alt="Plot data" />,
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
        </form>
        <button
          onClick={() => handlePlotDataOnClick()}
          className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none disabled:opacity-75"
        >
          Plot Data
        </button>
      </div>
    </Layout>
  )
}

export default ExportDataPage
