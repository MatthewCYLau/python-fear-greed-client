import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  url: string
  iconComponant: ReactNode
  copy: string
  description: string
}

const SideNavButton: FC<Props> = ({
  url,
  iconComponant,
  copy,
  description
}) => {
  return (
    <Link
      to={url}
      className="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
    >
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center">
        <div>{iconComponant}</div>
        <div>
          <p className="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-indigo-400">
            {copy}
          </p>
          <p className="text-slate-400 text-sm hidden md:block">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default SideNavButton
