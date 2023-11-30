// import * as d3 from 'd3'
import {axisLeft, axisBottom, scaleBand} from 'd3'

export const bandScale = (
    axis="x",
    data: {[key: string]: any}[],
    variable: string,
    size: number
    ) => { 
        const dims = axis === "x" ? [0, size] : [size, 0]
        return scaleBand()
            .range(dims)
            .domain(data.map(function(d) { return d[variable]; }))
            .padding(0.2);
}
export const bandAxis = (
    g: d3.Selection<SVGElement, {}, HTMLElement, any>,
    axis="x",
    scale: d3.ScaleBand<string>
    ) => {
        if (axis === "x") {
            return g.transition()
                .duration(1000)
                .call(axisBottom(scale))
        } else {
            return g.transition()
                .duration(1000)
                .call(axisLeft(scale))
        }
}
