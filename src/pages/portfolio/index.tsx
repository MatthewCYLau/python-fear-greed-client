import { ReactElement, useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout'
import Table from '../../components/table'
import { Store } from '../../store'
import KeyStatisticsCard from '../../components/key-statistics-card'
import { AxiosResponse } from 'axios'
import { PortfolioAnalysis } from '../../types'
import api from '../../utils/api'

const PortfolioPage = (): ReactElement => {
  const { state } = useContext(Store)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<PortfolioAnalysis>(
    {
      total_value: 0,
      portfolio_roi: 0,
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
            <KeyStatisticsCard
              subject="ROI %"
              index={portfolioAnalysis.portfolio_roi}
              icon="plotChart"
            />
          </div>
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
