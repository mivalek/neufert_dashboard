
import ScatterplotSkeleton from '@/components/scatterplot/plot-skeleton'
import HistogramSkeleton from '@/components/histogram/plot-skeleton'
import { Dropdown } from '@/components/ui/dropdown';
import { FloorplanViewer } from '@/components/floorplan_viewer/floorplan-viewer';

import styles from '@/components/styles.module.css'
import { Suspense } from 'react';

export function MultiplotContainer({
  width, height,
}:{
  width: number
  height: number
}) {
  const marValue = width * .04
  const margin = {top: marValue, right: 0, bottom: marValue, left: marValue * 1.5};
  const pointRadius = 8;
  
  return (
    <div id="multiplot" className={styles.multiplotGrid}>
      <div className={styles.sideways}>
        <Dropdown id="yVar"/>
      </div>
      <div className={styles.plotContainer} id="plots">
        <HistogramSkeleton
          id="y-histogram"
          height={height}
          width={width * .2}
          margin={margin}
          axisOffset={pointRadius}  // to match scatterplot axis offset by circle radius
        />
        <ScatterplotSkeleton
          height={height}
          width={width}
          margin={margin}
          pointRadius={pointRadius}
        />
        <HistogramSkeleton
          className={styles.col2}
          id="x-histogram"
          height={height * .2}
          width={width}
          margin={{top: 8, right: margin.right, bottom: margin.bottom, left: margin.left}}
          axisOffset={pointRadius}  // to match scatterplot axis offset by circle radius
        />
        </div>
      <FloorplanViewer
        width={1000}
        height={1000}
      />
      <div className={styles.col2}>
        <Dropdown id="xVar"/>
      </div>
    </div>
  )
}
