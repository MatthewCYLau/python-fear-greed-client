import {
  ReactElement,
  useState,
  ChangeEvent,
  useContext,
  useEffect,
  useRef
} from 'react'
import cn from 'classnames'
import { Store } from '../../store'
import { ActionType } from '../../types'
import { commonStockSymbols, years } from '../../constants'
import api from '../../utils/api'
import Layout from '../../components/layout'
import Loader from '../../components/loader'
import DeleteIcon from '../../components/icons/delete-icon'
import DropdownButton from '../../components/dropdown-button'
interface Values {
  stockSymbol: string
  years: number
}

const CumulativeReturnsPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showStockSymbolsDropdown, setShowStockSymbolsDropdown] =
    useState<boolean>(false)
  const [stocksList, setStocksList] = useState<string[]>([])
  const [stockSymbolsDropdownList, setstockSymbolsDropdownList] =
    useState<string[]>(commonStockSymbols)
  const [formValues, setFormValues] = useState<Values>({
    stockSymbol: '',
    years: 1
  })
  const yearsDropdownRef = useRef<HTMLDivElement>(null)
  const stockSymbolDropdownRef = useRef<HTMLDivElement>(null)

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

  const handleOnAddStockSymbol = () => {
    setStocksList([...stocksList, formValues.stockSymbol])
    setFormValues({ ...formValues, stockSymbol: '' })
  }

  const stockSymbolDropdownItemOnClickHandler = (item: string) => {
    setStocksList([...stocksList, item])
    setFormValues({ ...formValues, stockSymbol: '' })
    setShowStockSymbolsDropdown(false)
  }

  const handleOnStockDelete = (item: string) => {
    setStocksList(stocksList.filter((ele) => ele !== item))
  }

  const dropdownItemOnClickHandler = (n: number) => {
    setFormValues({ ...formValues, years: n })
    setShowDropdown(!showDropdown)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        yearsDropdownRef.current &&
        !yearsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
      if (
        stockSymbolDropdownRef.current &&
        !stockSymbolDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStockSymbolsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    setstockSymbolsDropdownList(
      commonStockSymbols.filter((n) =>
        n.toLowerCase().includes(formValues.stockSymbol.toLocaleLowerCase())
      )
    )
  }, [formValues.stockSymbol])

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Plot Cumulative Returns</h1>
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
              onFocus={() => setShowStockSymbolsDropdown(true)}
              onBlur={() =>
                setFormValues({
                  ...formValues,
                  stockSymbol: formValues.stockSymbol.toUpperCase()
                })
              }
            />
            {showStockSymbolsDropdown && (
              <div
                ref={stockSymbolDropdownRef}
                id="dropdown-menu"
                className={cn(
                  'absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 z-4 overflow-y-scroll max-h-24',
                  {
                    'visibility: hidden': stockSymbolsDropdownList.length == 0
                  }
                )}
              >
                {stockSymbolsDropdownList.map((n) => (
                  <DropdownButton
                    key={n}
                    copy={n}
                    dropdownItemOnClickHandler={() =>
                      stockSymbolDropdownItemOnClickHandler(n)
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mb-6">
            <button
              onClick={() => handleOnAddStockSymbol()}
              disabled={
                !formValues.stockSymbol ||
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
          <div className="relative group mb-6">
            <label
              htmlFor="timeAgoYears"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Time ago in years
            </label>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
              className="inline-flex justify-center w-full px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
            >
              <span className="mr-2">{formValues.years}</span>
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
                ref={yearsDropdownRef}
                id="dropdown-menu"
                className="absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 z-2"
              >
                {years.map((n) => (
                  <DropdownButton
                    copy={n}
                    dropdownItemOnClickHandler={() =>
                      dropdownItemOnClickHandler(n)
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <button
            disabled={stocksList.length === 0}
            onClick={(e) => handlePlotDataOnClick(e)}
            className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none"
          >
            Plot Data
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default CumulativeReturnsPage
