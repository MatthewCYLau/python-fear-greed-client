import { ChangeEvent, FC } from 'react'

interface Props {
  name: string
  id: string
  placeholder: string
  value: string
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void
  maxLength: number
}

const Input: FC<Props> = ({
  name,
  id,
  placeholder,
  value,
  onChangeHandler,
  maxLength
}) => {
  return (
    <>
      <input
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
        value={value}
        onChange={onChangeHandler}
      />
      <span
        className={`font-medium ${
          value.length >= maxLength ? 'text-red-400' : 'text-gray-600'
        }`}
      >
        {maxLength - value.length} characters remaining
      </span>
    </>
  )
}

export default Input
