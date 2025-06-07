import { ReactElement, useState, useContext } from 'react'
import Layout from '../../components/layout'
import api from '../../utils/api'
import { ActionType } from '../../types'
import SearchDropdown from '../../components/search-dropdown'
import { commonCurrencySymbols, years } from '../../constants'
import Loader from '../../components/loader'
import { Store } from '../../store'
import Dropdown from '../../components/dropdown'

interface Values {
  baseCurrency: string
  quoteCurrency: string
  years: number
}

const ForexPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<Values>({
    baseCurrency: '',
    quoteCurrency: '',
    years: 1
  })

  const dropdownItemOnClickHandler = (n: number) => {
    setFormValues({ ...formValues, years: n })
    setShowDropdown(!showDropdown)
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
        `${import.meta.env.VITE_API_BASE_URL}/api/generate-stock-plot?years=${
          formValues.years
        }&baseCurrency=${formValues.baseCurrency}&quoteCurrency=${
          formValues.quoteCurrency
        }`
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

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Plot Forex Data</h1>
        <div>
          <SearchDropdown
            onBlurHandler={() =>
              setFormValues({
                ...formValues,
                baseCurrency: formValues.baseCurrency.toUpperCase()
              })
            }
            value={formValues.baseCurrency}
            onChangeHandler={(e) =>
              setFormValues({ ...formValues, baseCurrency: e.target.value })
            }
            dropdownItems={commonCurrencySymbols}
            selectDropdownItem={(n: string) =>
              setFormValues({ ...formValues, baseCurrency: n })
            }
            header="Base Currency"
            placeholder="USD"
          />
          <SearchDropdown
            onBlurHandler={() =>
              setFormValues({
                ...formValues,
                quoteCurrency: formValues.quoteCurrency.toUpperCase()
              })
            }
            value={formValues.quoteCurrency}
            onChangeHandler={(e) =>
              setFormValues({
                ...formValues,
                quoteCurrency: e.target.value
              })
            }
            dropdownItems={commonCurrencySymbols}
            selectDropdownItem={(n: string) =>
              setFormValues({ ...formValues, quoteCurrency: n })
            }
            header="Quote Currency"
            placeholder="GBP"
          />
          <Dropdown
            header="Time ago in years"
            dropdownItems={years}
            value={formValues.years}
            selectDropdownItem={dropdownItemOnClickHandler}
          />
          <button
            onClick={handlePlotDataOnClick}
            disabled={!formValues.baseCurrency || !formValues.quoteCurrency}
            className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          >
            Plot Forex Data
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ForexPage
