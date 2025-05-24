import { ReactElement } from 'react'
import Layout from '../../components/layout'
import PlotMultiStocks from '../../components/plot-multi-stocks'

const ClosingPricesPage = (): ReactElement => {
  return (
    <Layout>
      <div className="m-7 w-1/2">
        <PlotMultiStocks header="Plot Closing Prices" plotData="closing" />
      </div>
    </Layout>
  )
}

export default ClosingPricesPage
