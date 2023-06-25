import { useContext, ReactNode } from 'react'
import { Store } from '../../store'
import UserCard from '../../components/user-card'
import SideNav from '../../components/side-nav'

type LayoutProps = {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { state } = useContext(Store)
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
        <div
          id="content"
          className="bg-white/10 col-span-9 rounded-lg p-6 relative"
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Layout
