import { FC } from 'react'

interface Props {
  onClickHandler?: () => void
  copy: string
}

const Toggle: FC<Props> = ({ onClickHandler, copy }) => {
  return (
    <div>
      <label
        htmlFor="price"
        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
      >
        {copy}
      </label>
      <div className="flex items-center justify-between w-64">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            onClick={onClickHandler}
          ></input>
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-400"></div>
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-full"></div>
        </label>
      </div>
    </div>
  )
}

export default Toggle
