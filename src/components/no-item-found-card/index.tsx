import { FC } from 'react'

interface Props {
  itemName: string
}

const NoItemsFoundCard: FC<Props> = ({ itemName }) => {
  return (
    <div className="flex justify-center">
      <span className="text-base text-white font-bold">{`No ${itemName}s found!`}</span>
    </div>
  )
}

export default NoItemsFoundCard
