'use client'

import { extent } from 'd3'
import React, { createContext, Dispatch, SetStateAction, useState, useContext } from 'react'

type Data = {[key: string]: any}

type DataFilter = {[key: string]: string | null}

type DataContextProviderProps = {
    predictionData: Data[]
    testSetData: Data[]
    children: React.ReactNode
}

type Variables = {xVar: string, yVar: string}
type SelectedColumns = {[key: string]: boolean}
type SelectedId = string
type SliderMoved = {[key:string]: boolean}
type DataContext = {
    filteredData: Data[]
    testData: Data[]
    spiderData: Data[]
    nDatapoints: number
    varRanges: {[key: string]: (number[] | [undefined, undefined])}
    variables: Variables
    setVariables: Dispatch<SetStateAction<Variables>>
    dataFilter: DataFilter
    setDataFilter: Dispatch<SetStateAction<DataFilter>>
    geometry: any
    setGeometry: Dispatch<SetStateAction<any>>
    selectedColumns: SelectedColumns
    setSelectedColumns: Dispatch<SetStateAction<SelectedColumns>>
    selectedId: SelectedId
    setSelectedId: Dispatch<SetStateAction<SelectedId>>,
    sliderMoved: SliderMoved
    setSliderMoved: Dispatch<SetStateAction<SliderMoved>>
}

const filterData = (data: Data, filter: DataFilter) => {
    const filteringString = Object.values(filter).filter(d => d).join(" && ")
    if (!filteringString.length) return data
    return data.filter(eval("d => " + filteringString))
}

export const DataContext = createContext<DataContext | null>(null);

export function DataContextProvider({ predictionData, testSetData, children }: DataContextProviderProps ) {
    const data = predictionData
    const colNames = Object.keys(data[0])

    const nDatapoints = data.length

    const [variables, setVariables] = useState<Variables>({xVar: colNames[0], yVar: colNames[1]});
    const [dataFilter, setDataFilter] = useState<DataFilter>(colNames.reduce((o, key) => ({ ...o, [key]: null}), {}) )
    const [selectedId, setSelectedId] = useState<SelectedId>("none")
    const [geometry, setGeometry] = useState<any>(null)
    // const geometry = getFlatGeometry(selectedId)
    // console.log(geometry);
    
    const initStates: SelectedColumns = {}
    colNames.forEach(c => {
        if (c === "id") return
        initStates[c] = true
    })
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>(initStates)
    
    const varRanges: {[key: string]: [number, number]} = {}
    colNames.forEach(k => {
        if (k === "id") return
        varRanges[k] = extent(data, (d:{[key: string]: any}) => d[k]) as [number, number]
    })
    const filteredData : Data[] = filterData(data, dataFilter)
    const testData : Data[] = filterData(testSetData, dataFilter)
    const spiderData: Data[] = [
        predictionData.filter(d => d.id == selectedId)[0],
        testSetData.filter(d => d.id == selectedId)[0]
    ]
    
    
    const initState: SliderMoved = {}
    colNames.forEach(v => initState[v] = false)
    const [sliderMoved, setSliderMoved] = useState(initState)

    return (
        <DataContext.Provider value={{
            filteredData,
            testData,
            spiderData,
            nDatapoints,
            varRanges,
            variables,
            setVariables,
            dataFilter,
            setDataFilter,
            geometry,
            setGeometry,
            selectedColumns,
            setSelectedColumns,
            selectedId,
            setSelectedId,
            sliderMoved,
            setSliderMoved
            }}>
            { children }
        </DataContext.Provider>
    )
}

export function useDataContext() {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error(
            "useDataContext must be used within a DataContextProvider"
        );
    }
    return context;
}