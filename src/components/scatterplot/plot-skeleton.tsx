import { DrawScatterPlot } from "@/components/draw-plots"
import React from "react"

import globStyles from '@/components/styles.module.css'

export default function plotSkeleton({
    width, height, margin, pointRadius
}:{
    width: number
    height: number
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    }
    pointRadius: number
}) {
    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.left - margin.right

    return (
        <>
        <svg viewBox={`0 0 ${width} ${height}`}>        
          <g id="scatterplot" style={{transform:`translate(${margin.left}px,${margin.top}px)`}}>
                <g id="x-axis" className={globStyles.axis} style={{transform:`translateY(${innerHeight}px)`}} fill="none"></g>
                <g className={globStyles.yAxis} fill="none"></g>
                <g id="y-axis" className={globStyles.axis}></g>
                <g id="x-grid" className={globStyles.grid}></g>
                <g id="y-grid" className={globStyles.grid}></g>
                <g className="brush"></g>
                <g className='scatter' clipPath='url(#mask)'>
                    <clipPath id="mask">
                        <rect x={0} y={0} height={innerHeight} width={innerWidth}/>
                    </clipPath>
                </g>
                <g className='confInt'></g>
                <g className='trendLine' fill='none' clipPath='url(#mask)'>
                    <path id='trend'></path>
                </g>
            </g>
        </svg>        
        <DrawScatterPlot
            selector="#scatterplot"
            width={innerWidth}
            height={innerHeight}
            margin={margin}
            circleRadius={pointRadius}
        />
        </>
    )
}
