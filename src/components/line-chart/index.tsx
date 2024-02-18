// @ts-nocheck
import React, { useEffect } from 'react'
import api from '../../utils/api'
import './chart.css'
import * as d3 from 'd3'

const margin = { top: 40, right: 20, bottom: 20, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 280 - margin.top - margin.bottom,
  color = 'OrangeRed'

const LineChart = () => {
  const [activeIndex, setActiveIndex] = React.useState(null),
    [data, setData] = React.useState([])

  const getRecords = async () => {
    try {
      const { data } = await api.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/records?count=365&order=asc`
      )
      data.forEach((i) => {
        i.created = new Date(Date.parse(i.created ? i.created : i.creatd))
        i.index = Number(i.index)
      })
      setData(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRecords()
  }, [])

  const yMinValue = d3.min(data, (d) => d.index),
    yMaxValue = d3.max(data, (d) => d.index)

  const getX = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.created))
    .range([0, width])

  const getY = d3
    .scaleLinear()
    .domain([yMinValue - 1, yMaxValue + 2])
    .range([height, 0])

  const getXAxis = (ref) => {
    const xAxis = d3.axisBottom(getX)
    d3.select(ref).call(xAxis.tickFormat(d3.timeFormat('%d/%m/%Y')))
  }

  const getYAxis = (ref) => {
    const yAxis = d3.axisLeft(getY).tickSize(-width).tickPadding(7)
    d3.select(ref).call(yAxis)
  }

  const linePath = d3
    .line()
    .x((d) => getX(d.created))
    .y((d) => getY(d.index))
    .curve(d3.curveMonotoneX)(data)

  const areaPath = d3
    .area()
    .x((d) => getX(d.created))
    .y0((d) => getY(d.index))
    .y1(() => getY(yMinValue - 1))
    .curve(d3.curveMonotoneX)(data)

  const handleMouseMove = (e) => {
    const bisect = d3.bisector((d) => d.created).left,
      x0 = getX.invert(d3.pointer(e, this)[0]),
      index = bisect(data, x0, 1)
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }
  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${width + margin.left + margin.right} 
                              ${height + margin.top + margin.bottom}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g className="axis" ref={getYAxis} />
        <g
          className="axis xAxis"
          ref={getXAxis}
          transform={`translate(0,${height})`}
        />
        <path fill={color} d={areaPath} opacity={0.3} />
        <path strokeWidth={3} fill="none" stroke={color} d={linePath} />

        <text
          transform={'rotate(-90)'}
          x={0 - height / 2}
          y={0 - margin.left}
          dy="1em"
        >
          {'Index'}
        </text>
        <text x={width / 2} y={0 - margin.top / 2} textAnchor="middle">
          {'Fear and Greed Index'}
        </text>
        {data.map((item, index) => {
          return (
            <g key={index}>
              <text
                fill="#666"
                x={getX(item.created)}
                y={getY(item.index) - 20}
                textAnchor="middle"
              >
                {index === activeIndex ? item.index : ''}
              </text>
              <circle
                cx={getX(item.created)}
                cy={getY(item.index)}
                r={index === activeIndex ? 6 : 4}
                fill={color}
                strokeWidth={index === activeIndex ? 2 : 0}
                stroke="#fff"
                style={{ transition: 'ease-out .1s' }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default LineChart
