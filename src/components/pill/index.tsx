import { FC } from 'react'
import cn from 'classnames'

interface Props {
  delta: number
}

const Pill: FC<Props> = ({ delta }) => {
  return (
    <span
      className={cn(
        'inline-flex px-2 text-xs font-semibold leading-5 rounded-full',
        {
          'text-red-800 bg-red-100': delta < 0,
          'text-green-800 bg-green-100': delta > 0,
          'text-yellow-800 bg-yellow-100': delta == 0
        }
      )}
    >
      {`${Math.round(delta * 100).toFixed(0)}%`}
    </span>
  )
}

export default Pill
