import { FC } from 'react'
import DownloadIcon from '../icons/download-icon'

interface Props {
  onClickHandler?: () => void
}

const CtaButton: FC<Props> = ({ onClickHandler }) => {
  return (
    <button
      onClick={onClickHandler}
      className="text-slate-300 hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
    >
      <DownloadIcon />
    </button>
  )
}

export default CtaButton
