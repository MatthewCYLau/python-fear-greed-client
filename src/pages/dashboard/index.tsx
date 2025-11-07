import { ReactElement, useEffect, useState, useContext } from 'react'
import { Store } from '../../store'
import { ActionType, ChartTypeValues, Domain } from '../../types'
import { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { Alert, Event } from '../../types'
import Layout from '../../components/layout'
import EventCard from '../../components/event-card'
import NoItemsFoundCard from '../../components/no-item-found-card'
import Loader from '../../components/loader'
import KeyStatisticsCard from '../../components/key-statistics-card'
import LineChart from '../../components/line-chart'
import DeleteIcon from '../../components/icons/delete-icon'
import CheckIcon from '../../components/icons/check-icon'
import { convertDateToValidFormet, getDateOneYearAgo } from '../../utils/date'

interface IndexValues {
  currentIndex: number
  previousIndex: number
}

interface KeyIndicesValues {
  sp500: {
    open: number
    previousClose: number
  }
  vix: {
    open: number
    previousClose: number
  }
}

const SP500_TICKER = '^GSPC'
const VIX_TICKER = '^VIX'

const DashboardPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [indexValues, setIndexValues] = useState<IndexValues>({
    currentIndex: 0,
    previousIndex: 0
  })
  const [keyIndicesValues, setKeyIndicesValues] = useState<KeyIndicesValues>({
    sp500: {
      open: 0,
      previousClose: 0
    },
    vix: {
      open: 0,
      previousClose: 0
    }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentUserAlerts, setCurrentUserAlerts] = useState<Alert[]>([])
  const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([])

  const getCurrentIndex = async () => {
    try {
      const { data }: AxiosResponse<any> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/records?count=2&order=desc`
      )
      setIndexValues({
        currentIndex: data[0].index,
        previousIndex: data[1].index
      })
    } catch (err) {
      console.log(err)
    }
  }
  const getKeyIndicesValues = async () => {
    try {
      const { data: sp500Data }: AxiosResponse<any> = await api.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis?index=${SP500_TICKER}`
      )
      const { data: vixData }: AxiosResponse<any> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis?index=${VIX_TICKER}`
      )
      setKeyIndicesValues({
        sp500: {
          open: sp500Data.open,
          previousClose: sp500Data.previousClose
        },
        vix: {
          open: vixData.open,
          previousClose: vixData.previousClose
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  const getCurrentUserAlerts = async () => {
    setIsLoading(true)
    try {
      const { data }: AxiosResponse<Alert[]> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts/me`
      )
      setCurrentUserAlerts(data)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUserEvents = async () => {
    try {
      const { data }: AxiosResponse<Event[]> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/events/me?acknowledged=False`
      )
      setCurrentUserEvents(data)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteAlertById = async (id: string) => {
    try {
      await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/${id}`)
      getCurrentUserAlerts()
    } catch (err) {
      console.log(err)
    }
  }

  const acknowledgeEventById = async (id: string) => {
    try {
      await api.put(`${import.meta.env.VITE_API_BASE_URL}/api/events/${id}`, {
        acknowledged: 'True'
      })
      getCurrentUserEvents()
    } catch (err) {
      console.log(err)
    }
  }

  const plotIndexOneYearChart = async () => {
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
      const toDate = new Date()
      const fromDate = getDateOneYearAgo()
      const res = await api.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/records/generate-plot?startDate=${convertDateToValidFormet(
          fromDate
        )}&endDate=${convertDateToValidFormet(toDate)}&chartType=${
          ChartTypeValues.SCATTER
        }&binSize=3`
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
        }/api/generate-stock-plot?stocks=${stockSymbol}&rollingAverageDays=50`
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: `${stockSymbol} Plot`,
          children: (
            <a
              href={res.data.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={res.data.image_url} alt={`${stockSymbol} Plot`} />
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

  const handleOnDelete = (id: string, domain: Domain) => {
    let onConfirm = (): void => {}
    switch (domain) {
      case 'event':
        onConfirm = () => {
          dispatch({ type: ActionType.REMOVE_MODAL })
          acknowledgeEventById(id)
        }
        break
      case 'alert':
        onConfirm = () => {
          dispatch({ type: ActionType.REMOVE_MODAL })
          deleteAlertById(id)
        }
        break
      default:
        break
    }
    dispatch({
      type: ActionType.SET_MODAL,
      payload: {
        message: `Do you want to delete ${domain}?`,
        onCancel: () => dispatch({ type: ActionType.REMOVE_MODAL }),
        onConfirm
      }
    })
  }

  useEffect(() => {
    getCurrentIndex()
    getKeyIndicesValues()
    getCurrentUserAlerts()
    getCurrentUserEvents()
  }, [])

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div id="key-statistics">
            <h1 className="font-bold py-4 uppercase">Key Statistics</h1>
            <div
              id="stats"
              className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <button onClick={plotIndexOneYearChart}>
                <KeyStatisticsCard
                  subject="Current Index"
                  index={indexValues.currentIndex}
                  previousIndex={indexValues.previousIndex}
                  icon="plotChart"
                />
              </button>
              <button onClick={() => plotStockChart(VIX_TICKER)}>
                <KeyStatisticsCard
                  subject="VIX"
                  index={keyIndicesValues.vix.open}
                  previousIndex={keyIndicesValues.vix.previousClose}
                  icon="alert"
                />
              </button>
              <button onClick={() => plotStockChart(SP500_TICKER)}>
                <KeyStatisticsCard
                  subject="S&P 500"
                  index={keyIndicesValues.sp500.open}
                  previousIndex={keyIndicesValues.sp500.previousClose}
                  icon="money"
                />
              </button>
            </div>
          </div>
          <div id="chart">
            <LineChart />
          </div>
          <div id="events">
            <h1 className="font-bold py-4 uppercase">Events</h1>
            {!!currentUserEvents.length ? (
              <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUserEvents.map((n) => (
                  <EventCard
                    id={n._id}
                    key={n._id}
                    index={n.index}
                    date={new Date(Date.parse(n.created)).toDateString()}
                    onDeleteHandler={() => handleOnDelete(n._id, 'event')}
                  />
                ))}
              </div>
            ) : (
              <NoItemsFoundCard itemName="event" />
            )}
          </div>
          <div id="alerts">
            <h1 className="font-bold py-4 uppercase">Alerts</h1>
            {!!currentUserAlerts.length ? (
              <table className="w-full whitespace-nowrap">
                <thead className="bg-black/60">
                  <tr>
                    <th className="text-left py-3 px-2 rounded-l-lg">
                      Created
                    </th>
                    <th className="text-left py-3 px-2">Index</th>
                    <th className="text-left py-3 px-2">Note</th>
                    <th className="text-left py-3 px-2 rounded-r-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                {currentUserAlerts.map((alert) => (
                  <tbody key={alert._id}>
                    <tr className="border-b border-gray-700">
                      <td className="py-3 px-2 font-bold">
                        {new Date(Date.parse(alert.created)).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">{alert.index}</td>
                      <td className="py-3 px-2">{alert.note}</td>
                      <td className="py-3 px-2">
                        <div className="inline-flex items-center space-x-3">
                          <Link
                            to={`/alerts/${alert._id}`}
                            className="hover:text-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleOnDelete(alert._id, 'alert')}
                            className="hover:text-white"
                          >
                            <DeleteIcon />
                          </button>
                          {alert.have_actioned && <CheckIcon colour="green" />}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            ) : (
              <NoItemsFoundCard itemName="alert" />
            )}
          </div>
        </>
      )}
    </Layout>
  )
}

export default DashboardPage
