import {
  ReactElement,
  useState,
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  FC
} from 'react'
import cn from 'classnames'
import { Store } from '../../store'
import { ActionType } from '../../types'
import { commonStockSymbolsAndIndices, years } from '../../constants'
import api from '../../utils/api'
import Loader from '../../components/loader'
import DeleteIcon from '../../components/icons/delete-icon'
import DropdownButton from '../../components/dropdown-button'
import Dropdown from '../dropdown'

interface Props {
  header: string
  plotData: 'closing' | 'cumulative'
}
interface Values {
  stockSymbol: string
  years: number
  secondaryAxis: string
}

const PlotMultiStocks: FC<Props> = ({ header, plotData }): ReactElement => {
  const { dispatch } = useContext(Store)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showStockSymbolsDropdown, setShowStockSymbolsDropdown] =
    useState<boolean>(false)
  const [stocksList, setStocksList] = useState<string[]>([])
  const [stockSymbolsDropdownList, setstockSymbolsDropdownList] = useState<
    string[]
  >(commonStockSymbolsAndIndices)
  const [formValues, setFormValues] = useState<Values>({
    stockSymbol: '',
    years: 1,
    secondaryAxis: 'No'
  })
  const yearsDropdownRef = useRef<HTMLDivElement>(null)
  const stockSymbolDropdownRef = useRef<HTMLDivElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
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

  const yearsDropdownItemOnClickHandler = (n: number) => {
    setFormValues({ ...formValues, years: n })
    setShowDropdown(!showDropdown)
  }

  const secondaryAxisDropdownItemOnClickHandler = (n: string) => {
    setFormValues({ ...formValues, secondaryAxis: n })
    setShowDropdown(!showDropdown)
  }

  const returnPlotDataResponse = async (plotData: 'closing' | 'cumulative') => {
    if (plotData == 'cumulative') {
      return await api.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/generate-stocks-cumulative-returns-plot`,
        {
          stocks: stocksList.join(','),
          years: +formValues.years
        }
      )
    } else {
      return await api.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/generate-stock-plot?stocks=${stocksList.join(
          ','
        )}&years=${+formValues.years}&secondaryAxis=${
          formValues.secondaryAxis == 'Yes'
        }`
      )
    }
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
      const res = await returnPlotDataResponse(plotData)
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
      commonStockSymbolsAndIndices.filter((n) =>
        n.toLowerCase().includes(formValues.stockSymbol.toLocaleLowerCase())
      )
    )
  }, [formValues.stockSymbol])

  return (
    <>
      <h1 className="font-bold py-4 uppercase">{header}</h1>
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
        <Dropdown
          header="Time ago in years"
          dropdownItems={years}
          value={formValues.years}
          selectDropdownItem={yearsDropdownItemOnClickHandler}
        />
        {stocksList.length == 1 && (
          <Dropdown
            header="Plot volatility against secondary axis"
            dropdownItems={['Yes', 'No']}
            value={formValues.secondaryAxis}
            selectDropdownItem={secondaryAxisDropdownItemOnClickHandler}
          />
        )}
        <button
          disabled={stocksList.length === 0}
          onClick={(e) => handlePlotDataOnClick(e)}
          className="w-full px-3 py-4 text-white bg-orange-400 rounded-md focus:bg-orange-500 focus:outline-none"
        >
          Plot Data
        </button>
      </div>
    </>
  )
}

export default PlotMultiStocks
