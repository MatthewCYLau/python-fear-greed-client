import { FC } from 'react'

interface Props {
  id: string
  header: string
  columns: string[]
  data: (string | number)[][]
}

const Table: FC<Props> = ({ id, header, columns, data }) => {
  return (
    <div className="m-7" id={id}>
      <h1 className="font-bold py-4 uppercase">{header}</h1>
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
              <td className="py-3 px-2 font-bold">{row[0]}</td>
              <td className="py-3 px-2">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
