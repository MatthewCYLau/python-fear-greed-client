import { FC } from 'react'
import PlotChartIcon from '../icons/plot-chart-icon'

interface Props {
  id: string
  header: string
  columns: string[]
  data: (string | number)[][]
  handlePlotChartIconOnClick?: () => void
}

const Table: FC<Props> = ({
  id,
  header,
  columns,
  data,
  handlePlotChartIconOnClick
}) => {
  return (
    <div className="m-7" id={id}>
      <div className="flex">
        <h1 className="font-bold py-4 uppercase">{header}</h1>
        {handlePlotChartIconOnClick && (
          <button
            onClick={handlePlotChartIconOnClick}
            className="hover:text-white ml-2"
          >
            <PlotChartIcon />
          </button>
        )}
      </div>
      <table className="w-full whitespace-nowrap table-fixed">
        <thead className="bg-black/60">
          <tr>
            {columns.map((n) => (
              <th className="text-left py-3 px-2">{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key="100" className="border-b border-gray-700">
              <td className="py-3 px-2 font-bold">{row.slice(0, 1)[0]}</td>
              {row.slice(1).map((column) => (
                <td className="py-3 px-2">{column}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
