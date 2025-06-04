import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import DropdownButton from '../dropdown-button'
import useOutsideClick from '../../utils/hook'

interface Props {
  onBlurHandler: () => void
  value: string
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void
  dropdownItems: string[]
  selectDropdownItem: (n: string) => void
  header: string
}

const SearchDropdown: FC<Props> = ({
  onBlurHandler,
  value,
  onChangeHandler,
  dropdownItems,
  selectDropdownItem,
  header
}) => {
  const [showStockSymbolsDropdown, setShowStockSymbolsDropdown] =
    useState<boolean>(false)
  const [filteredDropdownItems, setFilteredDropdownItems] =
    useState<string[]>(dropdownItems)
  const stockSymbolDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFilteredDropdownItems(
      dropdownItems.filter((n: string) =>
        n.toLowerCase().includes(value.toLocaleLowerCase())
      )
    )
  }, [value])

  useOutsideClick(stockSymbolDropdownRef, () =>
    setShowStockSymbolsDropdown(false)
  )

  return (
    <div className="relative mb-6">
      <label
        htmlFor="stockSymbol"
        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
      >
        {header}
      </label>
      <input
        autoComplete="off"
        type="text"
        name="stockSymbol"
        id="stockSymbol"
        placeholder="AAPL"
        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
        value={value}
        onChange={onChangeHandler}
        onFocus={() => setShowStockSymbolsDropdown(true)}
        onBlur={onBlurHandler}
      />
      {showStockSymbolsDropdown && !!filteredDropdownItems.length && (
        <div
          ref={stockSymbolDropdownRef}
          id="dropdown-menu"
          className={cn(
            'absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 z-4 overflow-y-scroll max-h-24',
            {
              'visibility: hidden': dropdownItems.length == 0
            }
          )}
        >
          {filteredDropdownItems.map((n) => (
            <DropdownButton
              key={n}
              copy={n}
              dropdownItemOnClickHandler={() => {
                selectDropdownItem(n)
                setShowStockSymbolsDropdown(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
