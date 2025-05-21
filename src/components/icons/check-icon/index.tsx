import { FC } from 'react'
import cn from 'classnames'

interface Props {
  colour?: 'green'
}

const CheckIcon: FC<Props> = ({ colour = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={cn('w-6 h-6 ', {
        [`stroke-${colour}-400`]: colour
      })}
    >
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckIcon
