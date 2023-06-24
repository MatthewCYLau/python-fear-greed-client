import { useContext, ReactElement, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import { Store } from '../../store'
import { Alert } from '../../types'
import UserCard from '../../components/user-card'
import SideNav from '../../components/side-nav'
import KeyStatisticsCard from '../../components/key-statistics-card'

const DashboardPage = (): ReactElement => {
  const { state } = useContext(Store)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentUserAlerts, setCurrentUserAlerts] = useState<Alert[]>([])
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
  const getCurrentUserAlerts = async () => {
    try {
      const { data }: AxiosResponse<Alert[]> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts/me`
      )
      setCurrentUserAlerts(data)
      setCurrentUserMostRecentAlert(data[0].index)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOnAlertDelete = async (id: string) => {
    try {
      await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/alerts/${id}`)
      getCurrentUserAlerts()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getCurrentIndex()
    getCurrentUserAlerts()
  }, [])

  useEffect(() => {
    if (!!currentUserAlerts.length) {
      setCurrentUserMostRecentAlert(currentUserAlerts[0].index)
    } else {
      setCurrentUserMostRecentAlert(0)
    }
  }, [currentUserAlerts])

  return (
    <div className="antialiased bg-black w-full min-h-screen text-slate-300 py-4">
      <div className="grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-7xl my-10 px-2">
        <div id="menu" className="bg-white/10 col-span-3 rounded-lg p-4 ">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Dashboard<span className="text-indigo-400">.</span>
          </h1>
          <p className="text-slate-400 text-sm mb-2">Welcome back,</p>
          <UserCard name={state.user.name} email={state.user.email} />
          <hr className="my-2 border-slate-700" />
          <SideNav />
        </div>
        <div id="content" className="bg-white/10 col-span-9 rounded-lg p-6">
          <div id="24h">
            <h1 className="font-bold py-4 uppercase">Key Statistics</h1>
            <div
              id="stats"
              className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <KeyStatisticsCard subject="Current Index" index={currentIndex} />
              <div className="bg-black/60 p-6 rounded-lg">
                <div className="flex flex-row space-x-4 items-center">
                  <div id="stats-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-10 h-10 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-teal-300 text-sm font-medium uppercase leading-4">
                      Current Alert
                    </p>
                    <p className="text-white font-bold text-2xl inline-flex items-center space-x-2">
                      <span>{currentUserMostRecentAlert}</span>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            stroke-linejoin="round"
                            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                          />
                        </svg>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="last-incomes">
            <h1 className="font-bold py-4 uppercase">Events</h1>
            <div
              id="stats"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <div className="bg-black/60 to-white/5 rounded-lg">
                <div className="flex flex-row items-center">
                  <div className="text-3xl p-4">💰</div>
                  <div className="p-2">
                    <p className="text-xl font-bold">35</p>
                    <p className="text-gray-500 font-medium">Date</p>
                    <p className="text-gray-500 text-sm">24 Nov 2022</p>
                  </div>
                </div>
                <div className="border-t border-white/5 p-4">
                  <a
                    href="#"
                    className="inline-flex space-x-2 items-center text-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        stroke-linejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                    <span>Info</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="last-users">
            <h1 className="font-bold py-4 uppercase">Alerts</h1>
            <div>
              <table className="w-full whitespace-nowrap">
                <thead className="bg-black/60">
                  <th className="text-left py-3 px-2 rounded-l-lg">Created</th>
                  <th className="text-left py-3 px-2">Index</th>
                  <th className="text-left py-3 px-2">Note</th>
                  <th className="text-left py-3 px-2 rounded-r-lg">Actions</th>
                </thead>
                {!!currentUserAlerts &&
                  currentUserAlerts.map((alert) => (
                    <tr key={alert._id} className="border-b border-gray-700">
                      <td className="py-3 px-2 font-bold">{alert.created}</td>
                      <td className="py-3 px-2">{alert.index}</td>
                      <td className="py-3 px-2">{alert.note}</td>
                      <td className="py-3 px-2">
                        <div className="inline-flex items-center space-x-3">
                          <button
                            onClick={() => handleOnAlertDelete(alert._id)}
                            className="hover:text-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                stroke-linejoin="round"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
