import { ReactElement, useState } from 'react'
import DatePicker from 'react-datepicker'
import Layout from '../../components/layout'

import 'react-datepicker/dist/react-datepicker.css'

const ExportDataPage = (): ReactElement => {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    console.log(`exporting data from ${fromDate} to ${toDate}`)
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
              className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
      </div>
    </Layout>
  )
}

export default ExportDataPage
