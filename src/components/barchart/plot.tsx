"use client"

import { useD3 } from '../../hooks/useD3';
import { max } from "d3"
import { linearAxis, linearScale, yGrid } from '../elements/d3-functions/axis-linear';
import { bandAxis, bandScale } from '../elements/d3-functions/axis-band';

const BarChart = ({
  data, width, height, margin
}:{
  data: {[key: string]: any}[]
  width: number
  height: number
  margin: {[key: string]: number}
}) => {    
    const ref = useD3((g) => {      
      const barLayer = g.select(".bars")
      const xAxisLayer = g.select(".xAxis")
      const yAxisLater = g.select(".yAxis")
      const xGridLayer = g.select(".xGrid")
      const yGridLayer = g.select(".yGrid")

      const xScale = bandScale("x", data, "group", width)
      bandAxis(xAxisLayer, "x", xScale)
      const yScale = linearScale("y", max, data, "count", height)
      linearAxis(yAxisLater, "y", yScale)

      yGrid(yGridLayer, yScale, width)

      barLayer
        .selectAll("rect")
        .data(data)
        .join("rect")
          .attr("x", (d: {group: any}) => xScale(d.group))
          .attr("width", xScale.bandwidth())
          .attr("fill", "#69b3a2")
          // no bar at the beginning thus:
          .attr("height", (d: {y: number}) => height - yScale(0)) // always equal to 0
          .attr("y", (d: {y: number}) => yScale(0))
        
            // update bars
        const u = barLayer
        .selectAll("rect")
        .data(data) 
        .join("rect")
        .transition()
        .duration(1000)
        .attr("x", function(d: {group: any}) { return xScale(d.group); })
        .attr("y", function(d: {count: number}) { return yScale(d.count); })
        .attr("height", function(d: {count: number}) { return height - yScale(d.count); })
    }, [data]);

    return (
      <g style={{transform:`translate(${margin.left}px,${margin.top}px)`}} ref={ref}>
          <g className='xAxis' style={{transform:`translateY(${height}px)`}}></g>
          <g className='yAxis'></g>
          <g className='yGrid' stroke='#000' strokeOpacity=".05" strokeWidth="1"></g>
          <g className='bars'></g>
      </g>
    );
}
export default BarChart;