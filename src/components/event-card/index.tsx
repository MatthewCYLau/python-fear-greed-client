import { useState, FC, useRef, useEffect } from 'react'
import DeleteIcon from '../icons/delete-icon'
import InfoIcon from '../icons/info-icon'

interface Props {
  id: string
  date: string
  index: number
  onDeleteHandler: () => void
}

const EventCard: FC<Props> = ({ id, date, index, onDeleteHandler }) => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const onClickHandler = () => {
    setShowToolTip(!showToolTip)
  }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowToolTip(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })
  return (
    <div key={id} className="bg-black/60 to-white/5 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="text-3xl p-4">💰</div>
        <div className="p-2">
          <p className="text-xl font-bold">{index}</p>
          <p className="text-gray-500 font-medium">Date</p>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
      </div>
      <div className="border-t border-white/5 p-4 relative flex flex-row justify-between">
        <button
          className="inline-flex space-x-2 items-center text-center"
          onClick={onClickHandler}
        >
          <InfoIcon />
          <span>Info</span>
        </button>
        {showToolTip && (
          <div
            ref={ref}
            className="z-20 -mt-30 w-64 absolute transition duration-150 ease-in-out left-20 ml-4 shadow-lg bg-gray-800 p-4 rounded"
          >
            <p className="text-sm font-bold text-white pb-1">
              Event Information
            </p>
            <p className="text-xs leading-4 text-white pb-3 ">
              Alert was triggered on <span className="font-bold">{date}</span>{' '}
              when index was <span className="font-bold">{index}</span>
            </p>
          </div>
        )}
        <button onClick={onDeleteHandler} className="hover:text-white">
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}

export default EventCard
