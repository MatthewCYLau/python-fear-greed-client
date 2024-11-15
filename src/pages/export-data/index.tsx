import { ReactElement, useState } from 'react'
import DatePicker from 'react-datepicker'
import api from '../../utils/api'
import { convertDateToValidFormet } from '../../utils/date'
import Layout from '../../components/layout'

import 'react-datepicker/dist/react-datepicker.css'

const ExportDataPage = (): ReactElement => {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

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
        <button className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none disabled:opacity-75">
          Plot Data
        </button>
      </div>
    </Layout>
  )
}

export default ExportDataPage
