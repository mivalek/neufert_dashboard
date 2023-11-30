import { makeLabel } from "@/functions/make-label"
import { scaleLinear, scalePoint, lineRadial } from "d3"
import React from "react"

import styles from "@/components/spider/spiderplot.module.css"

export default function plotSkeleton({
    data, varRanges, width, height, margin
}:{
    data: {[key: string]: number | string}[]
    varRanges: {[key: string]: [number, number]}
    width: number
    height: number
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    }
}) {
    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.left - margin.right

    data = data.map(d => {
        const row: {[key:string]: string | number} = {id: d.id}
        Object.keys(varRanges).forEach(col => row[col] = d[col] as number / varRanges[col][1])
        return row
    })


    const vars = Object.keys(varRanges)
    
    const outerRadius = Math.min(innerWidth, innerHeight) / 2
    const innerRadius = .2 * outerRadius
    const centre = {x: innerWidth/2, y: innerHeight/2}

    const xScale = scalePoint().range([0, Math.PI * 2 * 7/8]).domain(vars)
    const yScale = scaleLinear().range([innerRadius, outerRadius]).domain([0, 1])
      .domain([0, 1])
      .range([innerRadius, outerRadius])
    const axisTicks = [{val:0, width: 18}, {val:.25, width: 38}, {val:.5, width: 30}, {val:.75, width: 38}, {val:1, width:18}]
    return (
        <>
        <svg viewBox={`0 0 ${width} ${height}`}>        
          <g id="spiderplot" style={{transform:`translate(${margin.left}px,${margin.top}px)`}}>
                <g id="circles" fill="none">
                    {[.2, .4, .6, .8, 1 ].map(d => (
                    <circle
                        key={`circ${d}`}
                        cx={centre.x}
                        cy={centre.y}
                        r={d * outerRadius}
                        stroke="#fff2"
                    />
                    ))}
                </g>
                <g id="axis" fill="none">
                    {vars.map((v, i) => {
                        const lineCoords = [0, 1.02].map(lim => [xScale(v), yScale(lim)]) as [number, number][]
                        const translateAngle = i/vars.length * 2 * Math.PI
                        const translateValue = {
                            x: Math.sin(translateAngle) * innerWidth/1.88,
                            y: -Math.cos(translateAngle) * innerHeight/1.88
                        }
                        const rotateAngle = 360 * i/vars.length
                        const rotateValue = rotateAngle >= 91 && rotateAngle <= 269 ? rotateAngle - 180 : rotateAngle
                        return (
                        <g
                            key={`axisGroup${v}`}
                            className="radial-axis"
                            transform={`translate(${centre.x}, ${centre.y})`}
                        >
                            <path
                                d={lineRadial()(lineCoords) as string}
                            />
                            <g
                                transform={`translate(${translateValue.x}, ${translateValue.y})`}
                            >
                                <text
                                    transform={`rotate(${rotateValue})`}
                                >{makeLabel(v)}</text>
                            </g>
                            {/* <g
                                className="tick-group"
                            >
                                <g></g>
                            </g> */}
                        </g>
                    )})}
                </g>
                <g id="areas" transform={`translate(${centre.x}, ${centre.y})`}>
                    {data.map((datum, i) => (
                        <path
                            key={`axisLine${i}`}
                            d={lineRadial()(
                                vars.concat(vars[0])
                                    .map(v => [xScale(v), yScale(datum[v] as number)] as [number, number])) as string}
                            className={`${styles.area} ${i ? styles.observation : styles.prediction}`}
                        />
                    ))}
                </g>
            </g>
        </svg>
        </>
    )
}
