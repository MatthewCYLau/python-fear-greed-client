import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlotMultiStocks from '../../components/plot-multi-stocks'

const CumulativeReturnsPage = (): ReactElement => {
  return (
    <Layout>
      <div className="m-7 w-1/2">
        <PlotMultiStocks
          header="Plot Cumulative Returns"
          plotData="cumulative"
        />
      </div>
    </Layout>
  )
}

export default CumulativeReturnsPage
