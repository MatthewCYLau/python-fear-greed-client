import { useContext, ReactElement, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import { Store } from '../../store'
import { Alert } from '../../types'
import UserCard from '../../components/user-card'
import SideNav from '../../components/side-nav'
import KeyStatisticsCard from '../../components/key-statistics-card'

const CreateAlertPage = (): ReactElement => {
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
      console.log('error!')
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
      setCurrentUserAlerts
      console.log('error!')
    }
  }

  useEffect(() => {
    getCurrentIndex()
    getCurrentUserAlerts()
  }, [])

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
          <div className="m-7 w-1/2">
            <h1 className="font-bold py-4 uppercase">Create Alert</h1>
            <form>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  // value={formValues.email}
                  // onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Password
                  </label>
                  <a
                    href="#!"
                    className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  // value={formValues.password}
                  // onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAlertPage
