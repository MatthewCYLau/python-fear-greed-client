import { FC } from 'react'

interface Props {
  copy: string | number
  dropdownItemOnClickHandler: (item: string | number) => void
}

const DropdownButton: FC<Props> = ({ copy, dropdownItemOnClickHandler }) => {
  return (
    <button
      key={copy}
      onClick={() => dropdownItemOnClickHandler(copy)}
      className="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md"
    >
      {copy}
    </button>
  )
}

export default DropdownButton
