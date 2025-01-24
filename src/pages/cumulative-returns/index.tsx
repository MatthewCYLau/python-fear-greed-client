import { ReactElement, useState, ChangeEvent, useContext } from 'react'
import { Store } from '../../store'
import { ActionType } from '../../types'
import api from '../../utils/api'
import Layout from '../../components/layout'
import Loader from '../../components/loader'
import DeleteIcon from '../../components/icons/delete-icon'
interface Values {
  stockSymbol: string
  years: number
}

const CumulativeReturnsPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [stocksList, setStocksList] = useState<string[]>([])
  const [formValues, setFormValues] = useState<Values>({
    stockSymbol: '',
    years: 1
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handlePlotDataOnClick = async (
    e: React.SyntheticEvent
  ): Promise<void> => {
    e.preventDefault()
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
        }/api/generate-stocks-cumulative-returns-plot`,
        {
          stocks: stocksList.join(';'),
          years: +formValues.years
        }
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
      console.log(errors)
    }
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setStocksList([...stocksList, formValues.stockSymbol])
    setFormValues({ ...formValues, stockSymbol: '' })
  }

  const handleOnStockDelete = (item: string) => {
    setStocksList(stocksList.filter((ele) => ele !== item))
  }

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Plot Cumulative Returns</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              htmlFor="stockSymbol"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Stock Symbol
            </label>
            <input
              type="text"
              name="stockSymbol"
              id="stockSymbol"
              placeholder="AAPL"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={formValues.stockSymbol}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="mb-6">
            <button
              disabled={
                stocksList.length >= 5 ||
                stocksList.includes(formValues.stockSymbol)
              }
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
            >
              Add Stock Symbol
            </button>
          </div>
          {!!stocksList.length && (
            <div className="mb-6">
              {stocksList.map((n) => (
                <div key={n} className="py-2 flex justify-between">
                  <span>{n}</span>
                  <button
                    onClick={() => handleOnStockDelete(n)}
                    className="hover:text-white"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={(e) => handlePlotDataOnClick(e)}
            className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none disabled:opacity-75"
          >
            Plot Data
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default CumulativeReturnsPage
