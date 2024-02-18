import { ReactElement } from 'react'
import Layout from '../../components/layout'

const ExportDataPage = (): ReactElement => {
  const submitHandler = async (e: React.SyntheticEvent) => {
    console.log('export data...')
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
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              htmlFor="file_input"
            >
              To date
            </label>
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
