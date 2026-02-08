import 'chart.js/auto'
import { ReactElement, useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout'
import Table from '../../components/table'
import { Store } from '../../store'
import KeyStatisticsCard from '../../components/key-statistics-card'
import { AxiosResponse } from 'axios'
import { Doughnut } from 'react-chartjs-2'
import {
  IndividualPortfolioData,
  PortfolioAnalysis,
  ActionType
} from '../../types'
import api from '../../utils/api'
import { generateColours } from '../../utils/string'
import Loader from '../../components/loader'

const getDoughnutData = (portfolio_data: IndividualPortfolioData[]) => ({
  labels: portfolio_data.map((n) => n.stock_symbol),
  datasets: [
    {
      label: 'weight %',
      data: portfolio_data.map((n) => n.weight * 100),
      backgroundColor: generateColours(portfolio_data.length),
      hoverOffset: 4
    }
  ]
})

const PortfolioPage = (): ReactElement => {
  const { state, dispatch } = useContext(Store)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis>(
    {
      total_value: 0,
      portfolio_roi: 0,
      portfolio_alpha: 0,
      portfolio_data: []
    }
  )
  const getUserPortfolioAnalysis = async () => {
    try {
      const { data }: AxiosResponse<PortfolioAnalysis> = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${
          state.user._id
        }/portfolio-analysis`
      )
      setPortfolioAnalysis(data)
    } catch (err) {
      console.log(err)
    }
  }
  const plotPortfolioRoiChart = async () => {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${
          state.user._id
        }/generate-portfolio-roi-plot`
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: 'Portfolio ROI vs. S&P 500 Benchmark',
          children: (
            <a
              href={res.data.image_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={res.data.image_url}
                alt={'Portfolio ROI vs. S&P 500 Benchmark'}
              />
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

  useEffect(() => {
    getUserPortfolioAnalysis()
  }, [])
  return (
    <Layout>
      <>
        <div id="key-statistics">
          <h1 className="font-bold py-4 uppercase">Portfolio Statistics</h1>
          <div
            id="portfolio-stats"
            className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <KeyStatisticsCard
              subject="Total Value"
              index={portfolioAnalysis.total_value}
              icon="money"
            />
            <button onClick={plotPortfolioRoiChart}>
              <KeyStatisticsCard
                subject="ROI %"
                index={portfolioAnalysis.portfolio_roi}
                icon="plotChart"
              />
            </button>
            <KeyStatisticsCard
              subject="Alpha %"
              index={portfolioAnalysis.portfolio_alpha}
              icon="info"
            />
          </div>
        </div>
        <div className="m-7 w-1/2" id="chart">
          <Doughnut data={getDoughnutData(portfolioAnalysis.portfolio_data)} />
        </div>
        <Table
          id="stock-portfolio"
          header="Stock Portfolio"
          columns={['Stock symbol', 'Quantity', 'Weight']}
          data={portfolioAnalysis.portfolio_data.map((n) => [
            n.stock_symbol,
            n.quantity,
            (n.weight * 100).toFixed(2) + '%'
          ])}
        ></Table>
      </>
    </Layout>
  )
}

export default PortfolioPage
