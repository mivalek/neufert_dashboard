// import * as d3 from 'd3'
import {axisLeft, axisBottom, scaleLinear, Selection, ScaleLinear} from 'd3'

export const linearScale = (
    axis="x",
    fun: Function,
    data: {
        id: string
        [key: string]: any
    }[],
    variable: string,
    size: number,
    offset=0
    ) => {        
        const dims = axis === "x" ? [0 + offset, size - offset] : [size - offset, 0 + offset]
        const fun_result = fun(data, (d: {[key: string]: any}) => d[variable])
        const domainLimits = typeof(fun_result) === "object" ? fun_result : [0, fun_result]
        return scaleLinear().range(dims).domain(domainLimits)
}
export const linearAxis = (
    g: Selection<SVGElement, {}, HTMLElement, any>,
    axis="x",
    scale: ScaleLinear<number, number>,
    transition = true,
    ticks = 10
    ) => {
        const myAxis = axis === "x" ?
            axisBottom(scale) :
            axisLeft(scale)

        myAxis.ticks(ticks)
        return g.transition()
            .duration(transition ? 1000 : 0)
            .call(myAxis as any)
}

export const grid = (
    axis: string,
    g: Selection<SVGElement, {}, HTMLElement, any>,
    scale: ScaleLinear<number, number>,
    width: number,
    height: number,
    margin: {[key: string]: number},
    transition = true,
    ticks = 10
    ) => g
        .selectAll('line')
        .data(scale.ticks(ticks))
        .join('line')
        .transition()
        .duration(transition ? 1000 : 0)
        .attr('x1', axis === "x" ? d => scale(d) : 0)
        .attr('x2', axis === "x" ? d => scale(d) : width)
        .attr('y1', axis === "x" ? margin.top - margin.bottom : d => scale(d))
        .attr('y2', axis === "x" ? height - margin.bottom + margin.top : d => scale(d))
