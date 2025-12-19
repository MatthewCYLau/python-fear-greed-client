import { ReactElement, useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { Order, OrdersResponse } from '../../types'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import NoItemsFoundCard from '../../components/no-item-found-card'
import PaginationNavButton from '../../components/pagination-nav-button'

const OrdersPage = (): ReactElement => {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(1)
  const pageSize: number = 5
  const getOrders = async () => {
    try {
      const { data }: AxiosResponse<OrdersResponse> = await api.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/orders?page=${currentPage}&pageSize=${pageSize}`
      )
      setOrders(data.data)
      setPageCount(data.paginationMetadata.totalPages)
    } catch (err) {
      console.log(err)
    }
  }
  const handleOnNextPageClick = () => setCurrentPage(currentPage + 1)
  const handleOnPreviousPageClick = () => setCurrentPage(currentPage - 1)
  useEffect(() => {
    getOrders()
  }, [])

  useEffect(() => {
    getOrders()
  }, [currentPage])

  return (
    <Layout>
      <div className="m-7" id="orders">
        <h1 className="font-bold py-4 uppercase">Stock Trade Orders</h1>
        {!!orders.length ? (
          <>
            <table className="w-full whitespace-nowrap">
              <thead className="bg-black/60">
                <tr>
                  <th className="text-left py-3 px-2">Created</th>
                  <th className="text-left py-3 px-2">Order Type</th>
                  <th className="text-left py-3 px-2">Price</th>
                  <th className="text-left py-3 px-2">Quantity</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Stock Symbol</th>
                </tr>
              </thead>
              {orders.map((order) => (
                <tbody key={order._id}>
                  <tr key={order._id} className="border-b border-gray-700">
                    <td className="py-3 px-2 font-bold">
                      {new Date(Date.parse(order.created)).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">{order.order_type}</td>
                    <td className="py-3 px-2">{order.price}</td>
                    <td className="py-3 px-2">{order.quantity}</td>
                    <td className="py-3 px-2">{order.status}</td>
                    <td className="py-3 px-2">{order.stock_symbol}</td>
                  </tr>
                </tbody>
              ))}
            </table>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <PaginationNavButton
                disabled={currentPage === 1}
                onClickHandler={() => setCurrentPage(1)}
                copy="<<"
              />
              <PaginationNavButton
                disabled={currentPage === 1}
                onClickHandler={handleOnPreviousPageClick}
                copy="<"
              />
              <div className="text-slate-500">{`${currentPage} / ${pageCount}`}</div>
              <PaginationNavButton
                disabled={currentPage === pageCount}
                onClickHandler={handleOnNextPageClick}
                copy=">"
              />
              <PaginationNavButton
                disabled={currentPage === pageCount}
                onClickHandler={() => setCurrentPage(pageCount)}
                copy=">>"
              />
            </div>
          </>
        ) : (
          <NoItemsFoundCard itemName="orders" />
        )}
      </div>
    </Layout>
  )
}

export default OrdersPage
