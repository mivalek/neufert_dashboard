'use client'
import React from 'react'
import { useDataContext } from '@/contexts/data-context'
import { range } from 'd3'

export function Points({width, height}:{
    width:number
    height: number
}) {
    const { filteredData, variables, nDatapoints } = useDataContext()
  return (
    filteredData.map((d, i) => <circle key={i} r="5" cx={d[variables.xVar] * 200} cy={d[variables.yVar]* 200} fill='blue'></circle>)
  )
}
