import { useContext, ReactElement, useState, ChangeEvent } from 'react'
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import { Store } from '../../store'
import UserCard from '../../components/user-card'
import SideNav from '../../components/side-nav'

interface Values {
  index: number
  note: string
}

const CreateAlertPage = (): ReactElement => {
  const { state } = useContext(Store)
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<Values>({
    index: 0,
    note: ''
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await api.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/alerts`,
        {
          index: +formValues.index,
          note: formValues.note
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      navigate('/dashboard')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="antialiased bg-black w-full min-h-screen text-slate-300 py-4">
      <div className="grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-7xl my-10 px-2">
        <div id="menu" className="bg-white/10 col-span-3 rounded-lg p-4 ">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
            Dashboard<span className="text-indigo-400">.</span>
          </h1>
          <p className="text-slate-400 text-sm mb-2">Welcome back,</p>
          <UserCard name={state.user.name} email={state.user.email} />
          <hr className="my-2 border-slate-700" />
          <SideNav />
        </div>
        <div id="content" className="bg-white/10 col-span-9 rounded-lg p-6">
          <div className="m-7 w-1/2">
            <h1 className="font-bold py-4 uppercase">Create Alert</h1>
            <form onSubmit={submitHandler}>
              <div className="mb-6">
                <label
                  htmlFor="index"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Index
                </label>
                <input
                  type="text"
                  name="index"
                  id="index"
                  placeholder="50"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  value={formValues.index}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="note"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Note
                  </label>
                </div>
                <input
                  type="text"
                  name="note"
                  id="note"
                  placeholder="Add a custom note"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  value={formValues.note}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAlertPage
