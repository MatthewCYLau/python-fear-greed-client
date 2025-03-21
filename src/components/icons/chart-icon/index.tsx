import { FC } from 'react'
import cn from 'classnames'

interface Props {
  positiveTrend: boolean
}

const ChartIcon: FC<Props> = ({ positiveTrend = true }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={cn('w-6 h-6 ', {
        'stroke-green-400': positiveTrend,
        'rotate-180 scale-x-[-1] stroke-red-400': !positiveTrend
      })}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  )
}

export default ChartIcon
