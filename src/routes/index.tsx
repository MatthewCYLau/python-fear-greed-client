import { createBrowserRouter } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { Store } from '../store'
import HomePage from '../pages/home'
import SignUpPage from '../pages/sign-up'
import LoginPage from '../pages/login'
import DashboardPage from '../pages/dashboard'
import CreateAlertPage from '../pages/create-alert'
import EditAlertPage from '../pages/edit-alert'
import UpdateUserPage from '../pages/update-user'
import ExportDataPage from '../pages/export-data'
import ImportDataPage from '../pages/import-data'
import AnalysisJobPage from '../pages/analysis-job'
import CumulativeReturnsPage from '../pages/cumulative-returns'
import AnalyseStockPage from '../pages/analyse-stock'
import ClosingPricesPage from '../pages/closing-prices'
import ForexPage from '../pages/forex'

type PrivateRouteProps = {
  component: React.ComponentType<any>
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component
}) => {
  const { state } = useContext(Store)
  if (state.isAuthenticated) return <Component />
  return <Navigate to="/login" />
}

export const router = createBrowserRouter([
  {
    path: '/sign-up',
    element: <SignUpPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute component={DashboardPage} />
  },
  {
    path: '/create-alert',
    element: <PrivateRoute component={CreateAlertPage} />
  },
  {
    path: '/update-user',
    element: <PrivateRoute component={UpdateUserPage} />
  },
  {
    path: '/export-data',
    element: <PrivateRoute component={ExportDataPage} />
  },
  {
    path: '/import-data',
    element: <PrivateRoute component={ImportDataPage} />
  },
  {
    path: '/analyse-stock',
    element: <PrivateRoute component={AnalyseStockPage} />
  },
  {
    path: '/analysis-job',
    element: <PrivateRoute component={AnalysisJobPage} />
  },
  {
    path: '/closing-prices',
    element: <PrivateRoute component={ClosingPricesPage} />
  },
  {
    path: '/cumulative-returns',
    element: <PrivateRoute component={CumulativeReturnsPage} />
  },
  {
    path: '/forex',
    element: <PrivateRoute component={ForexPage} />
  },
  {
    path: '/alerts/:id',
    element: <PrivateRoute component={EditAlertPage} />
  },
  {
    path: '/*',
    element: <HomePage />
  }
])
