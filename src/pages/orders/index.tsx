import StockPicker from '../../components/search-dropdown'
import { v4 as uuid } from 'uuid'
import {
  ChangeEvent,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import Layout from '../../components/layout'
import { Order, OrdersResponse } from '../../types'
import { ActionType, AnalysisJob, AnalysisJobsResponse } from '../../types'
import { ActionType as AlertActionType } from '../../store/alert/action-types'
import { AxiosResponse } from 'axios'
import api from '../../utils/api'
import NoItemsFoundCard from '../../components/no-item-found-card'
import PaginationNavButton from '../../components/pagination-nav-button'
import { useNavigate } from 'react-router-dom'
import { Store } from '../../store'
import { commonStockSymbols } from '../../constants'
import Dropdown from '../../components/dropdown'
import DeleteIcon from '../../components/icons/delete-icon'
import Toggle from '../../components/toggle'

interface CreateOrderValues {
  stock: string
  orderType: string
  quantity: number
  price: number
}

const OrdersPage = (): ReactElement => {
  const navigate = useNavigate()
  const { dispatch } = useContext(Store)
  const [createOrderformValues, setCreateOrderformValues] =
    useState<CreateOrderValues>({
      stock: '',
      orderType: 'BUY',
      quantity: 0,
      price: 0
    })
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageCount, setPageCount] = useState<number>(1)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showOpenOrdersOnly, setShowOpenOrdersOnly] = useState<boolean>(false)
  const pageSize: number = 5
  const orderTypeDropdownRef = useRef<HTMLDivElement>(null)

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

  const onCreateOrderFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateOrderformValues({
      ...createOrderformValues,
      [e.target.name]: e.target.value
    })
  }

  const createOrderSubmitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          stock_symbol: createOrderformValues.stock,
          order_type: createOrderformValues.orderType,
          quantity: createOrderformValues.quantity,
          price: createOrderformValues.price
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      dispatch({
        type: ActionType.SET_MODAL,
        payload: {
          message: 'Order placed.',
          onConfirm: () => {
            dispatch({ type: ActionType.REMOVE_MODAL })
            navigate('/dashboard')
          }
        }
      })
    } catch (err: any) {
      const errors: Error[] = err.response.data.errors
      errors.forEach((e) =>
        dispatch({
          type: AlertActionType.SET_ALERT,
          payload: { id: uuid(), message: e.message, severity: 'error' }
        })
      )
    }
  }

  const orderTypeDropdownItemOnClickHandler = (n: string) => {
    setCreateOrderformValues({ ...createOrderformValues, orderType: n })
    setShowDropdown(!showDropdown)
  }
  const handleOnNextPageClick = () => setCurrentPage(currentPage + 1)
  const handleOnPreviousPageClick = () => setCurrentPage(currentPage - 1)
  useEffect(() => {
    getOrders()
  }, [])

  const deleteOrderById = async (id: string) => {
    try {
      await api.delete(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`)
      getOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const handleOnDelete = (id: string) => {
    dispatch({
      type: ActionType.SET_MODAL,
      payload: {
        message: `Do you want to delete order?`,
        onCancel: () => dispatch({ type: ActionType.REMOVE_MODAL }),
        onConfirm: () => {
          dispatch({ type: ActionType.REMOVE_MODAL })
          deleteOrderById(id)
        }
      }
    })
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        orderTypeDropdownRef.current &&
        !orderTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    getOrders()
  }, [currentPage])

  return (
    <Layout>
      <div className="m-7 w-1/2">
        <h1 className="font-bold py-4 uppercase">Create Stock Trade Order</h1>
        <form onSubmit={createOrderSubmitHandler}>
          <StockPicker
            header="Stock Symbol"
            onBlurHandler={() =>
              setCreateOrderformValues({
                ...createOrderformValues,
                stock: createOrderformValues.stock.toUpperCase()
              })
            }
            value={createOrderformValues.stock}
            onChangeHandler={(e) =>
              setCreateOrderformValues({
                ...createOrderformValues,
                stock: e.target.value
              })
            }
            dropdownItems={commonStockSymbols}
            selectDropdownItem={(n: string) =>
              setCreateOrderformValues({
                ...createOrderformValues,
                stock: n
              })
            }
            placeholder="AAPL"
          />
          <Dropdown
            header="Order type"
            dropdownItems={['BUY', 'SELL']}
            value={createOrderformValues.orderType}
            selectDropdownItem={orderTypeDropdownItemOnClickHandler}
          />
          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Quantity
            </label>
            <input
              type="text"
              name="quantity"
              id="quantity"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createOrderformValues.quantity}
              onChange={(e) => onCreateOrderFormChange(e)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              value={createOrderformValues.price}
              onChange={(e) => onCreateOrderFormChange(e)}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none disabled:opacity-75"
            >
              Create Stock Trade Order
            </button>
          </div>
        </form>
      </div>
      <div className="m-7" id="toggle">
        <Toggle
          copy="Show open orders only"
          onClickHandler={() => setShowOpenOrdersOnly(!showOpenOrdersOnly)}
        />
      </div>
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
                  <th className="text-left py-3 px-2 rounded-r-lg">Actions</th>
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
                    <td className="py-3 px-2 uppercase">{order.status}</td>
                    <td className="py-3 px-2">{order.stock_symbol}</td>
                    <td className="py-3 px-2">
                      <div className="inline-flex items-center space-x-3">
                        <button
                          onClick={() => handleOnDelete(order._id)}
                          className="hover:text-white"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
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
