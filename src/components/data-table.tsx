'use client'
import React from 'react'
import { useDataContext } from '@/contexts/data-context'

type Data = {
    [key: string]: any
}
export function DataTable() {    
    const { filteredData } = useDataContext();

  return (
    <>
    <div><em>N</em>: {filteredData.length}</div>    
    <table style={{fontSize: ".8em"}}>
        <thead>
            <tr>
            {Object.keys(filteredData[0]).map(d => <th key={d}>{d}</th>)}
            </tr>
        </thead>
        <tbody>
            {filteredData.map((d, i) => (
                <tr key={i}>
                    {Object.keys(d).map(k => <td key={`row${i}-${k}`}>{d[k]}</td>)}
                </tr>
            ))}
        </tbody>
    </table>
    </>
  )
}
