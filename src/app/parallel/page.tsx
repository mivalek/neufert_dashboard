import React from 'react'

import { SelectSwitches } from '@/components/ui/select-switches'
import { ParallelCoordSkeleton } from '@/components/parallel-coord/plot-skeleton'


export default async function Page(){
    const width = 1000
    const marValue = width * .04
    const margin = {top: marValue * .5, right: 0, bottom: marValue * 2, left: marValue * 1};
    return (
        <main>
            <h1>Parallel coordinates</h1>
            <>
            <SelectSwitches/>
            <ParallelCoordSkeleton
                width={width}
                height={500}
                margin={margin}
            />
            </>
        </main>
    )
}
