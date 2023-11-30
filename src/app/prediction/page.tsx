import React from 'react'

import { DataTable } from '@/components/data-table'
import { MultiplotContainer } from '@/components/multiplot-container'
import { SliderGroup } from '@/components/ui/slider-group'
import SpiderPlotSkeleton from '@/components/spider/plot-skeleton'

export default async function Page(){
    return (
        <main>
            <h1>Scatter plot</h1>
            <>
            <SliderGroup/>
            <MultiplotContainer
                width={1000}
                height={1000}
            />
            {/* <DataTable/> */}
            </>
        </main>
    )
}
