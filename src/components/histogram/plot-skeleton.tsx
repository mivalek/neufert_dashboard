import React from "react"
import { DrawHistogram } from "@/components/draw-plots"

import styles from '@/components/histogram/histogram.module.css'
import globStyles from '@/components/styles.module.css'

export default function plotSkeleton({
    className, id, width, height, margin, axisOffset
}:{
    className?: string
    id: string
    width: number
    height: number
    margin: {
        top: number,
        right: number,
        bottom: number,
        left: number
    }
    axisOffset: number  // to match scatterplot axis offset by circle radius
}) {
    const innerHeight = height - margin.top - margin.bottom
    const innerWidth = width - margin.left - margin.right

    return (
        <>
        <svg viewBox={`0 0 ${width} ${height}`} className={className}>        
        <g id={id} style={{transform: (id === "y-histogram" ? `rotateY(180deg) translate(${margin.left/4}px, ${margin.top}px)`: `translate(${margin.left}px,${margin.top}px)`), transformOrigin: "center" }}>
            <g id="x-axis" className={id === "y-histogram" ? `${globStyles.axis} ${styles.mirroredTick}` : 'hidden'} style={{transform:`translateY(${innerHeight}px)`}} fill="none">
                <path className="domain" stroke="currentColor" d={`M0.5,6V0.5H${innerWidth}.5V6`}></path>
            </g>            
            <g id="y-axis" className={id === "y-histogram" ? 'hidden' : globStyles.axis} fill="none">
                <path className="domain" stroke="currentColor" d={`M-6,${innerHeight}.5H0.5V0.5H-6`}></path></g>
            <g id="x-grid" className={id === "y-histogram" ? globStyles.grid : 'hidden'}></g>
            <g id="y-grid" className={id === "y-histogram" ? 'hidden' : globStyles.grid}></g>
            <g className='bars'></g>
            <g className='brush'></g>
        </g>
        </svg>
        <DrawHistogram
            selector={`#${id}`}
            width={innerWidth}
            height={innerHeight}
            margin={margin}
            axisOffset={axisOffset}  // to match scatterplot axis offset by circle radius
        />
        </>
    )

}
