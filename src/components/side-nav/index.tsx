import { useContext } from 'react'
import { Store } from '../../store'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import { Link } from 'react-router-dom'
import DownloadIcon from '../icons/download-icon'
import PlusIcon from '../icons/plus-icon'

const SideNav = () => {
  const { dispatch } = useContext(Store)

  const logout = () => dispatch({ type: AuthActionType.LOGOUT })
  return (
    <div id="menu" className="flex flex-col space-y-2 my-5">
      <Link
        to="/dashboard"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 group-hover:text-indigo-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
              Dashboard
            </p>
            <p className="text-slate-400 text-sm hidden md:block">
              Data overview
            </p>
          </div>
        </div>
      </Link>
      <Link
        to="/create-alert"
        className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
      >
        <div className="relative flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 group-hover:text-indigo-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 group-hover:text-indigo-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
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
            <svg
              fill="#FFFFFF"
              height="20px"
              width="20px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 471.2 471.2"
              xmlSpace="preserve"
              stroke="currentColor"
            >
              <path
                d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5
			s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5
			S235.019,444.2,227.619,444.2z"
              />
              <path
                d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5
			s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8
			C455.319,239.9,455.319,231.3,450.019,226.1z"
              />
            </svg>
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
