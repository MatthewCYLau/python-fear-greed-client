import { FC } from 'react'
import PeopleIcon from '../icons/people-icon'
import ChartIcon from '../icons/chart-icon'

interface Props {
  subject: string
  index: number
  previousIndex?: number
}

const KeyStatisticsCard: FC<Props> = ({ subject, index, previousIndex }) => {
  return (
    <div className="bg-black/60 to-white/5 p-6 rounded-lg">
      <div className="flex flex-row space-x-4 items-center">
        <div id="stats-1">
          <PeopleIcon />
        </div>
        <div>
          <p className="text-indigo-300 text-sm font-medium uppercase leading-4">
            {subject}
          </p>
          <p className="text-white font-bold text-2xl inline-flex items-center space-x-2">
            <span>{index}</span>
            <span>
              <ChartIcon
                positiveTrend={previousIndex ? index > previousIndex : true}
              />
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default KeyStatisticsCard
