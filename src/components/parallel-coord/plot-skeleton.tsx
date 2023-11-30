import React from "react"
import { DrawParallelCoord } from "@/components/draw-plots"

import styles from '@/components/parallel-coord/parallel-coord.module.css'
import globStyles from '@/components/styles.module.css'
import { CoordAxes } from "@/components/parallel-coord/coord-axes"

export function ParallelCoordSkeleton({
    width, height, margin
}:{
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

    return (
        <>
        <DrawParallelCoord
            selector={`#parallel-coords`}
            width={width}
            height={innerHeight}
            margin={margin}
        />
        <svg className={styles.plotContainer}  id="parallel-coords" viewBox={`0 0 ${width} ${height}`}>        
        <g style={{transform: `translate(${margin.left}px,${margin.top}px)`}}>
            <g className={styles.paths}></g>      
            <g id="y-axes" className={styles.axis}>
                <CoordAxes height={innerHeight} width={innerWidth}/>
            </g>
        </g>
        </svg>
        </>
    )

}
