import { FC } from 'react'

interface Props {
  disabled: boolean
  onClickHandler?: () => void
  copy: string
}

const PaginationNavButton: FC<Props> = ({ disabled, onClickHandler, copy }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      className="rounded-md px-2 text-3xl cursor-pointer disabled:cursor-default text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none disabled:opacity-75 disabled:bg-indigo-500"
    >
      {copy}
    </button>
  )
}

export default PaginationNavButton
