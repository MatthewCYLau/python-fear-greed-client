import { FC, useState, useRef } from 'react'
import InfoIcon from '../../components/icons/info-icon'
import useOutsideClick from '../../utils/hook'

interface Props {
  targetPeRatio: number
  targetFearGreedIndex: number
}

const AnalysisJobInfo: FC<Props> = ({
  targetPeRatio,
  targetFearGreedIndex
}) => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleInfoIconOnClick = () => setShowToolTip(!showToolTip)
  useOutsideClick(ref, () => setShowToolTip(false))

  return (
    <div className="relative flex">
      <button
        onClick={() => handleInfoIconOnClick()}
        className="hover:text-white"
      >
        <InfoIcon />
      </button>
      {showToolTip && (
        <div
          ref={ref}
          className="z-20 -mt-50 w-64 absolute transition duration-150 ease-in-out ml-8 shadow-lg bg-gray-800 p-4 rounded right-8 bottom-4"
        >
          <p className="text-sm font-bold text-white pb-1">
            Analysis Job Information
          </p>
          <p className="text-xs leading-4 text-white pb-3 whitespace-normal">
            Job was created for target PE ratio of{' '}
            <span className="font-bold">{targetPeRatio}</span> and Fear & Greed
            index of <span className="font-bold">{targetFearGreedIndex}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default AnalysisJobInfo
