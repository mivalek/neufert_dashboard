'use client'
import React from 'react'

import { useDataContext } from '@/contexts/data-context'
import { makeLabel } from '@/functions/make-label'

export function CoordAxes({ height, width }: {height: number, width: number}) {
    const { selectedColumns } = useDataContext()
    const variables = Object.keys(selectedColumns).filter(c => selectedColumns[c])
  return (
    variables.map(v => (
        <g key={v} id={v} className="coordinate-axis" transform={`translate(${width/2}, 0)`} strokeOpacity={0} fillOpacity={0}>
            <path className="domain" d={`M-6,${height}H0V0H-6`}></path>
            <text style={{fontSize: "1.4em", textAnchor: "end", transform: "translate(-11%, 4%) rotate(-15deg)"}} y={height + 15}>{makeLabel(v)}</text>
        </g>
    ))
  )
}
