import { ReactElement } from 'react'

import Layout from '../../components/layout'

const OrdersPage = (): ReactElement => {
  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Stock Trade Orders</h1>
      </div>
    </Layout>
  )
}

export default OrdersPage
