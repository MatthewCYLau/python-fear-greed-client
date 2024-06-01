import { FC, useState } from 'react'
import InfoIcon from '../../components/icons/info-icon'

const AnalysisJobInfo: FC = () => {
  const [showToolTip, setShowToolTip] = useState<boolean>(false)

  const handleInfoIconOnClick = () => setShowToolTip(!showToolTip)

  return (
    <div className="relative">
      <button
        onClick={() => handleInfoIconOnClick()}
        className="hover:text-white"
      >
        <InfoIcon />
      </button>
      {showToolTip && (
        <div className="z-20 -mt-50 w-64 absolute transition duration-150 ease-in-out ml-8 shadow-lg bg-gray-800 p-4 rounded right-8 bottom-4">
          <p className="text-sm font-bold text-white pb-1">
            Analysis Job Information
          </p>
        </div>
      )}
    </div>
  )
}

export default AnalysisJobInfo