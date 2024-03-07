import { useContext } from 'react'
import { Store } from '../../store'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { Link } from 'react-router-dom'
import DownloadIcon from '../icons/download-icon'
import PlusIcon from '../icons/plus-icon'
import LogoutIcon from '../icons/logout-icon'
import CogwheelIcon from '../icons/cogwheel-icon'
import HomeIcon from '../icons/home-icon'
import DocumentIcon from '../icons/document-icon'
import SideNavButton from '../side-nav-button'

const SideNav = () => {
  const { dispatch } = useContext(Store)

  const logout = () => dispatch({ type: AuthActionType.LOGOUT })
  return (
    <div id="menu" className="flex flex-col space-y-2 my-5">
      <SideNavButton
        url="/dashboard"
        iconComponant={<HomeIcon />}
        copy="Dashboard"
        description="Data overview"
      />
      <Link
        to="/create-alert"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="relative flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <DocumentIcon />
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Create Alert
            </p>
            <p className="text-slate-400 text-sm hidden md:block">
              Create new alerts
            </p>
          </div>
        </div>
      </Link>
      <Link
        to="/export-data"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="relative flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <DownloadIcon />
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Export Data
            </p>
            <p className="text-slate-400 text-sm hidden md:block">
              Export data to CSV
            </p>
          </div>
        </div>
      </Link>
      <Link
        to="/update-user"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <CogwheelIcon />
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Settings
            </p>
            <p className="text-slate-400 text-sm hidden md:block">
              Edit settings
            </p>
          </div>
        </div>
      </Link>
      <Link
        to="/analysis-job"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <PlusIcon />
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Analysis Job
            </p>
            <p className="text-slate-400 text-sm hidden md:block">
              Create, and get analysis job
            </p>
          </div>
        </div>
      </Link>
      <button
        onClick={logout}
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <LogoutIcon />
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Logout
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

export default SideNav
