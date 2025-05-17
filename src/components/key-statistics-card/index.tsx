import { FC, ReactNode } from 'react'
import MoneyIcon from '../icons/money-icon'
import ChartIcon from '../icons/chart-icon'
import PlotChartIcon from '../icons/plot-chart-icon'
import PeopleIcon from '../icons/people-icon'

type IconName = 'money' | 'plotChart' | 'people'

interface Props {
  subject: string
  index: number
  previousIndex?: number
  icon: IconName
}

const returnIcon = (iconName: IconName): ReactNode => {
  switch (iconName) {
    case 'money':
      return <MoneyIcon />
    case 'plotChart':
      return <PlotChartIcon />
    case 'people':
      return <PeopleIcon />
    default:
      break
  }
}

const KeyStatisticsCard: FC<Props> = ({
  subject,
  index,
  previousIndex,
  icon = 'plotChart'
}) => {
  return (
    <div className="bg-black/60 to-white/5 p-6 rounded-lg">
      <div className="flex flex-row space-x-4 items-center">
        <div id="stats-1">{returnIcon(icon)}</div>
        <div>
          <p className="text-indigo-300 text-sm font-medium uppercase leading-4">
            {subject}
          </p>
          <p className="text-white font-bold text-2xl inline-flex items-center space-x-2">
            <span>{index}</span>
            {previousIndex && (
              <span>
                <ChartIcon
                  positiveTrend={previousIndex ? index > previousIndex : true}
                />
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default KeyStatisticsCard
