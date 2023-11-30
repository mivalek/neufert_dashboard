'use client'
import React from 'react'
import { Paths } from './paths';
import { useDataContext } from '@/contexts/data-context';
import SpiderPlotSkeleton from '../spider/plot-skeleton';

import styles from '@/components/floorplan_viewer/floorpla-viewer.module.css'
import spiderStyles from '@/components/spider/spiderplot.module.css'
import { makeLabel } from '@/functions/make-label';
import { getObsData } from '@/functions/get-data';

export function FloorplanViewer({width, height}:{width:number, height:number}) {
    // const margin = (Math.sqrt(height ** 2 + width ** 2 ) - height) / 3
    const margin = 60
    
    const { spiderData, varRanges, geometry } = useDataContext();
    if (!geometry || ! spiderData[0]) return
   

    const ranges: {[key:string]: [number, number]} = varRanges as {[key: string]: [number, number]}
    ranges["has_loggia"] = [0, 1]
    ranges["bathroom_has_window"] = [0, 1]
    ranges["corridor_area_ratio"] = [0, 1]

    const columns = Object.keys(varRanges)
    let details: {[key: string]: {[key: string]: number}} = {}
    columns.forEach(c => details[c] = {
        prediction: ~~(spiderData[0][c] * 100) / 100,
        observation: ~~(spiderData[1][c] * 100) / 100
    })

    const hoverIn = () => document.getElementById("floorplan-viewer")
            ?.classList.add(styles.hovered)

    const hoverOut = () => document.getElementById("floorplan-viewer")
            ?.classList.remove(styles.hovered)
    
    return (        
        <div id="floorplan-viewer" className={styles.floorplanViewer}>
            <div id="spider-plot" onMouseEnter={hoverIn} onMouseLeave={hoverOut} className={spiderStyles.spider}>
            <SpiderPlotSkeleton
                data={spiderData}
                varRanges={ranges}
                width={500}
                height={500}
                margin={{top: 22, right: 22, left: 22, bottom: 22}}            
            />
            </div>
            <div>
                <div id="details" className={styles.detailsGrid}>
                    <div id="id" className={styles.span2}>{spiderData[0].id}</div>
                    <table className={styles.detailsTable}>
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Prediction</th>
                                <th>Truth</th>
                            </tr>
                        </thead>
                        <tbody>
                    {
                    columns.map(c => (
                        <tr key={c} id={c}>
                            <td className={styles.label}>{makeLabel(c)}</td>
                            <td className={styles.prediction}>{details[c]["prediction"]}</td>
                            <td className={styles.observation}>{details[c]["observation"]}</td>
                        </tr>
                        )
                    )
                    }
                    </tbody>
                    </table>
                </div>

                {/* <svg className={styles.spin} viewBox={`0 0 ${width} ${height}`}> */}
                <svg className={styles.floorplan} viewBox={`0 0 ${width} ${height}`}>
                <g 
                style={{transform:`translate(${margin}px,${margin}px)`}}
                >
                <Paths
                    data={geometry}
                    width={width - 2 * margin}
                    height={height - 2 * margin}
                    margin={margin}
                />
                </g>
                </svg>
            </div>
        </div>
    )
}
