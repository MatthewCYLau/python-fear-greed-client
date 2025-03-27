import { ReactElement, useState, ChangeEvent } from 'react'

import Layout from '../../components/layout'

interface Values {
  stockSymbol: string
}

const AnalyseStockPage = (): ReactElement => {
  const [formValues, setFormValues] = useState<Values>({
    stockSymbol: ''
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Analyse Stock</h1>
        <div>
          <div className="relative mb-6">
            <label
              htmlFor="stockSymbol"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Stock Symbol
            </label>
            <input
              autoComplete="off"
              type="text"
              name="stockSymbol"
              id="stockSymbol"
              placeholder="AAPL"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.stockSymbol}
              onChange={(e) => onChange(e)}
            />
          </div>
          <button
            onClick={() => console.log('Analyse stock')}
            className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          >
            Analyse Stock
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default AnalyseStockPage
