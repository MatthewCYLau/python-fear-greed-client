import { FC, useRef, useState } from 'react'
import cn from 'classnames'
import DropdownButton from '../dropdown-button'
import useOutsideClick from '../../utils/hook'
import { Currency } from '../../types'

interface Props {
  header: string
  value: string | number
  dropdownItems: string[] | Currency[] | number[]
  selectDropdownItem: (n: any) => void
}

const Dropdown: FC<Props> = ({
  header,
  value,
  dropdownItems,
  selectDropdownItem
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOutsideClick(dropdownRef, () => setShowDropdown(false))

  return (
    <div className="relative group mb-6">
      <label
        htmlFor="regularContributionAmount"
        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
      >
        {header}
      </label>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        type="button"
        className="inline-flex justify-center w-full px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
      >
        <span className="mr-2">{value}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn('w-5 h-5 ml-2 -mr-1', {
            'rotate-180': showDropdown
          })}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="dropdown-menu"
          className="absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 z-2"
        >
          {dropdownItems.map((n) => (
            <DropdownButton
              copy={n}
              dropdownItemOnClickHandler={() => {
                selectDropdownItem(n as Currency)
                setShowDropdown(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
