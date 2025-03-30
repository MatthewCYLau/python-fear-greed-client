import { useContext } from 'react'
import { Store } from '../../store'
import { ActionType as AuthActionType } from '../../store/auth/action-types'
import DownloadIcon from '../icons/download-icon'
import UploadIcon from '../icons/upload-icon'
import PlusIcon from '../icons/plus-icon'
import LogoutIcon from '../icons/logout-icon'
import CogwheelIcon from '../icons/cogwheel-icon'
import HomeIcon from '../icons/home-icon'
import DocumentIcon from '../icons/document-icon'
import SideNavButton from '../side-nav-button'
import PlotChartIcon from '../icons/plot-chart-icon'
import InfoIcon from '../icons/info-icon'

const SideNav = () => {
  const { dispatch } = useContext(Store)

  const logout = () => dispatch({ type: AuthActionType.LOGOUT })
  return (
    <div id="sidenav" className="flex flex-col space-y-2 my-5">
      <SideNavButton
        url="/dashboard"
        iconComponant={<HomeIcon />}
        copy="Dashboard"
        description="Data overview"
      />
      <SideNavButton
        url="/create-alert"
        iconComponant={<DocumentIcon />}
        copy="Create Alert"
        description="Create new alerts"
      />
      <SideNavButton
        url="/export-data"
        iconComponant={<DownloadIcon />}
        copy="Export Data"
        description="Export data to CSV"
      />
      <SideNavButton
        url="/import-data"
        iconComponant={<UploadIcon />}
        copy="Import Data"
        description="Import data from CSV"
      />
      <SideNavButton
        url="/analyse-stock"
        iconComponant={<InfoIcon />}
        copy="Analyse Stock"
        description="Analyse individual stock"
      />
      <SideNavButton
        url="/analysis-job"
        iconComponant={<PlusIcon />}
        copy="Analysis Job"
        description="Create, and get analysis job"
      />
      <SideNavButton
        url="/cumulative-returns"
        iconComponant={<PlotChartIcon />}
        copy="Cumulative Returns"
        description="Plot cumulative returns"
      />
      <SideNavButton
        url="/update-user"
        iconComponant={<CogwheelIcon />}
        copy="Settings"
        description="Edit settings"
      />
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
