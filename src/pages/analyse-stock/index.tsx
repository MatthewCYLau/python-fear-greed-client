import { ReactElement, useState, ChangeEvent, useContext } from 'react'
import Layout from '../../components/layout'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import { v4 as uuid } from 'uuid'
import { ActionType as AlertActionType } from '../../store/alert/action-types'
import { ActionType, StockData } from '../../types'
import { formatAmountTwoDecimals } from '../../utils/string'
import KeyStatisticsCard from '../../components/key-statistics-card'
import StockPicker from '../../components/stock-picker'
import { commonStockSymbols } from '../../constants'
import Loader from '../../components/loader'
import { Store } from '../../store'

interface Values {
  stockSymbol: string
}

interface stockAnalysisResult {
  stock: string
  close: number
  delta: number
  fairValue: number
  rollingAverages: {
    50: number
    100: number
    200: number
  }
  data: StockData[]
}

const AnalyseStockPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<Values>({
    stockSymbol: ''
  })
  const [stockAnalysisResult, setStockAnalysisResult] =
    useState<stockAnalysisResult>({
      stock: '',
      close: 0,
      delta: 0,
      fairValue: 0,
      rollingAverages: {
        50: 0,
        100: 0,
        200: 0
      },
      data: []
    })
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const plotStockChart = async (stockSymbol: string) => {
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
        }/api/generate-stock-plot?stock=${stockSymbol}&rollingAverageDays=50`
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
              <img
                src={res.data.image_url}
                alt={`${formValues.stockSymbol} Stock Plot`}
              />
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

  const handleAnalyseStock = async () => {
    setIsLoading(true)
    try {
      const { data }: AxiosResponse<any> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis?stock=${
          formValues.stockSymbol
        }&targetFearGreedIndex=50&targetPeRatio=25`
      )
      setStockAnalysisResult({
        stock: data.stock,
        close: data.close,
        delta: data.delta,
        fairValue: data.fairValue,
        rollingAverages: {
          50: data.rolling_averages['50'],
          100: data.rolling_averages['100'],
          200: data.rolling_averages['200']
        },
        data: data.data.map((val: { Close: number; Date: string }) => ({
          close: val.Close,
          date: val.Date
        }))
      })
    } catch (err: any) {
      const errorMessage = err.response.data.message
      dispatch({
        type: AlertActionType.SET_ALERT,
        payload: { id: uuid(), message: errorMessage, severity: 'error' }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Analyse Stock</h1>
        <div>
          <StockPicker
            onBlurHandler={() =>
              setFormValues({
                ...formValues,
                stockSymbol: formValues.stockSymbol.toUpperCase()
              })
            }
            value={formValues.stockSymbol}
            onChangeHandler={(e) => onChange(e)}
            dropdownItems={commonStockSymbols}
            selectDropdownItem={(n: string) =>
              setFormValues({ ...formValues, stockSymbol: n })
            }
          />
          <button
            onClick={handleAnalyseStock}
            className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          >
            Analyse Stock
          </button>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        !!stockAnalysisResult.data.length && (
          <>
            <div className="m-7" id="key-statistics">
              <h1 className="font-bold py-4 uppercase">Key Statistics</h1>
              <div
                id="stats"
                className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <button onClick={() => plotStockChart(formValues.stockSymbol)}>
                  <KeyStatisticsCard
                    subject={`${stockAnalysisResult.stock}`}
                    index={stockAnalysisResult.close}
                    previousIndex={stockAnalysisResult.data[1].close}
                    icon="plotChart"
                  />
                </button>
              </div>
            </div>
            <div className="m-7" id="rolling-averages">
              <h1 className="font-bold py-4 uppercase">Rolling Averages</h1>
              <table className="w-full whitespace-nowrap table-fixed">
                <thead className="bg-black/60">
                  <tr>
                    <th className="text-left py-3 px-2 rounded-l-lg">Days</th>
                    <th className="text-left py-3 px-2">Rolling Average</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key="50" className="border-b border-gray-700">
                    <td className="py-3 px-2 font-bold">50</td>
                    <td className="py-3 px-2">
                      {stockAnalysisResult.rollingAverages[50]}
                    </td>
                  </tr>
                  <tr key="100" className="border-b border-gray-700">
                    <td className="py-3 px-2 font-bold">100</td>
                    <td className="py-3 px-2">
                      {stockAnalysisResult.rollingAverages[100]}
                    </td>
                  </tr>
                  <tr key="200" className="border-b border-gray-700">
                    <td className="py-3 px-2 font-bold">200</td>
                    <td className="py-3 px-2">
                      {stockAnalysisResult.rollingAverages[200]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="m-7" id="historical-prices">
              <h1 className="font-bold py-4 uppercase">Historical Prices</h1>
              <table className="w-full whitespace-nowrap table-fixed">
                <thead className="bg-black/60">
                  <tr>
                    <th className="text-left py-3 px-2 rounded-l-lg">Date</th>
                    <th className="text-left py-3 px-2">Close</th>
                  </tr>
                </thead>
                <tbody>
                  {stockAnalysisResult.data.map((n) => (
                    <tr key={n.date} className="border-b border-gray-700">
                      <td className="py-3 px-2 font-bold">
                        {new Date(Date.parse(n.date)).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {formatAmountTwoDecimals(n.close.toString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </Layout>
  )
}

export default AnalyseStockPage
