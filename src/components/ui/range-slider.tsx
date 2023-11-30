'use client'
import React, {Dispatch, useState } from 'react'
import { extent } from 'd3';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider'
import { useDataContext } from '@/contexts/data-context'

function valuetext(value: number) {
    return `${value}`;
}

type Data = {[key: string]: any}

export function RangeSlider(
    {
        variable
    }:{
        variable: string
    }) {
    const { varRanges, setDataFilter, filteredData, sliderMoved, setSliderMoved } = useDataContext();

    const defaultRange = varRanges[variable] as number[]
    const currentRange = extent(filteredData.map(d => d[variable])) as number[]
    // const step = Math.round((defaultRange[1] - defaultRange[0]) / 50 * 100) / 100
    const step = .1
    const [value, setValue] = useState<number[]>(sliderMoved[variable] ? currentRange : defaultRange);


    const handleChange = (event: Event, value: number | number[]) => {
        const val = value as number[]  
        if (val[0] >= val[1] ) return
        setValue(val);
    };

    const handleChangeEnd = (event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]) => {
        const val = value as number[]  
        if (val[0] >= val[1] ) return
        setDataFilter(prevState => ({
                ...prevState,
                [variable]: `d["${variable}"] >= ${val[0]} && d["${variable}"] <= ${val[1]}`
        }))
        setSliderMoved(prevState => ({
            ...prevState,
            [variable]: val[0] !== defaultRange[0] || val[1] !== defaultRange[1]
        }))
    };

    return (        
        <Box sx={{ width: 300 }}>   
            <Slider
                value={value}
                min={defaultRange[0]}
                max={defaultRange[1]}
                step={step}
                onChange={handleChange}
                onChangeCommitted={handleChangeEnd}
            />
        </Box>
    )
}
