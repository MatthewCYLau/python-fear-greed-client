import { useState, FC } from 'react'
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

  const onClickHandler = () => {
    setShowToolTip(!showToolTip)
  }
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
          {showToolTip && (
            <div
              id="tooltip3"
              role="tooltip"
              className="z-20 -mt-50 w-64 absolute transition duration-150 ease-in-out left-20 ml-8 shadow-lg bg-gray-800 p-4 rounded"
            >
              <svg
                className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                width="9px"
                height="16px"
                viewBox="0 0 9 16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Tooltips-"
                    transform="translate(-874.000000, -1029.000000)"
                    fill="#2D3748"
                  >
                    <g
                      id="Group-3-Copy-16"
                      transform="translate(850.000000, 975.000000)"
                    >
                      <g
                        id="Group-2"
                        transform="translate(24.000000, 0.000000)"
                      >
                        <polygon
                          id="Triangle"
                          transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                          points="4.5 57.5 12.5 66.5 -3.5 66.5"
                        ></polygon>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <p className="text-sm font-bold text-white pb-1">
                Event Information
              </p>
              <p className="text-xs leading-4 text-white pb-3 ">
                Alert was triggered on <span className="font-bold">{date}</span>{' '}
                when index was <span className="font-bold">{index}</span>
              </p>
            </div>
          )}
        </button>
        <button onClick={onDeleteHandler} className="hover:text-white">
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}

export default EventCard
