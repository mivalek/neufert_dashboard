import { geoIdentity, geoPath } from 'd3';

import styles from '@/components/floorplan_viewer/floorpla-viewer.module.css'
import { log } from 'console';

type GeomProperty = {
    apt: string
    flr: string
    bld: string
    type: string
}
type MyFeatureCollection = d3.ExtendedFeatureCollection & {id: string} 
type Coordinates = [number, number]
export const Paths = ({
    data, width, height, margin
}:{
    data: MyFeatureCollection
    width: number
    height: number
    margin: number
}) => {
    if (!data) return (<text>Nothing</text>)
    const projection = geoIdentity().fitSize([width, height], data);
    const path = geoPath(projection);
    const meter = (projection([0, 1]) as Coordinates)[1] - (projection([0, 0]) as Coordinates)[1]
    const legendOffset = -margin * .5
    const legendFontSize = 30
    
    return (
    <g className="floorplan" id={"_" + data.id} fill="none" stroke="#aaa">
        <g transform={`translate(0, ${legendOffset})`}>
        <path
            d={`M${width},${legendFontSize - 5}V${legendFontSize - 15}H${width - 5 * meter}V${legendFontSize - 5}`}
            stroke='#fff'
            fill='none'
        />
        <text x={width - 2.5*meter} y={0} fontSize={legendFontSize} textAnchor='middle' fill="var(--font-col)" stroke='none'>5m</text>
        </g>
        {data.features.map((feature, i) => {
            const pathType: string = (feature.properties as GeomProperty).type 
        return (
            <path
                id={pathType}
                className={styles[pathType] + " " + (pathType === "apartment" ? styles.outline : styles.area)}
                key={i}
                d={path(feature) as string}
            />
        );
        })}
    </g>
)};
