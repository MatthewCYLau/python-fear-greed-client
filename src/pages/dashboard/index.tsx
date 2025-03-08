import { ReactElement, useEffect, useState, useContext } from 'react'
import { Store } from '../../store'
import { ActionType, Domain, IndexAnalysisResponse } from '../../types'
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
import ChartIcon from '../../components/icons/chart-icon'
import MoneyIcon from '../../components/icons/money-icon'

const DashboardPage = (): ReactElement => {
  const { dispatch } = useContext(Store)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [spyAnalysis, setSpyAnalysis] = useState<IndexAnalysisResponse>({
    open: 0,
    previousClose: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentUserAlerts, setCurrentUserAlerts] = useState<Alert[]>([])
  const [currentUserEvents, setCurrentUserEvents] = useState<Event[]>([])
  const [currentUserMostRecentAlert, setCurrentUserMostRecentAlert] =
    useState<number>(0)
  const getCurrentIndex = async () => {
    try {
      const { data }: AxiosResponse<any> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/records`
      )
      setCurrentIndex(data[0].index)
    } catch (err) {
      console.log(err)
    }
  }
  const getSpyOpen = async () => {
    try {
      const { data }: AxiosResponse<any> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/analysis?index=SPY`
      )
      setSpyAnalysis(data)
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
      if (!!data.length) {
        setCurrentUserMostRecentAlert(data[0].index)
      } else setCurrentUserMostRecentAlert(0)
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
    getSpyOpen()
    getCurrentUserAlerts()
    getCurrentUserEvents()
  }, [])

  useEffect(() => {
    if (!!currentUserAlerts.length) {
      setCurrentUserMostRecentAlert(currentUserAlerts[0].index)
    }
  }, [currentUserAlerts])

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
              <KeyStatisticsCard subject="Current Index" index={currentIndex} />
              {!!currentUserAlerts.length && (
                <div className="bg-black/60 p-6 rounded-lg">
                  <div className="flex flex-row space-x-4 items-center">
                    <div id="stats-1">
                      <MoneyIcon />
                    </div>
                    <div>
                      <p className="text-teal-300 text-sm font-medium uppercase leading-4">
                        Latest Alert
                      </p>
                      <p className="text-white font-bold text-2xl inline-flex items-center space-x-2">
                        <span>{currentUserMostRecentAlert}</span>
                        <span>
                          <ChartIcon />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <KeyStatisticsCard subject="S&P 500" index={spyAnalysis.open} />
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
                          {alert.have_actioned && <CheckIcon />}
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
