// @ts-nocheck
"use client";
import React from "react";
import {
  axisLeft,
  bin,
  brush,
  brushX,
  brushY,
  extent,
  max,
  line,
  scaleLinear,
  scalePoint,
  select,
  selectAll,
  range,
  BaseType,
} from "d3";
import { regressionLoess } from "d3-regression";

import {
  linearAxis,
  linearScale,
  grid,
} from "@/components/elements/d3-functions/axis-linear";
import { getFlatGeometry } from "@/functions/get-flat-geometry";

import scatterStyles from "@/components/scatterplot/scatterplot.module.css";
import histStyles from "@/components/histogram/histogram.module.css";
import parallelStyles from "@/components/parallel-coord/parallel-coord.module.css";

type ScatterDatum = { id: string; x: number; y: number };
export function updateScatterPlot(
  data: {
    id: string;
    x: number;
    y: number;
  }[],
  // plotZoom: {x: number[] | null, y: number[] | null},
  props: {
    selector: string;
    width: number;
    height: number;
    margin: { [key: string]: number };
    circleRadius: number;
  },
  setGeomFun: React.Dispatch<any>,
  setIdFun: React.Dispatch<any>
) {
  const { selector, width, height, margin, circleRadius } = props;
  const g = select(selector);
  let selectedIDs: string[] = [];
  const scatterLayer = g.select(".scatter");
  const xAxisLayer = g.select("#x-axis") as d3.Selection<
    SVGElement,
    {},
    HTMLElement,
    any
  >;
  const yAxisLayer = g.select("#y-axis") as d3.Selection<
    SVGElement,
    {},
    HTMLElement,
    any
  >;
  const xGridLayer = g.select("#x-grid") as d3.Selection<
    SVGElement,
    {},
    HTMLElement,
    any
  >;
  const yGridLayer = g.select("#y-grid") as d3.Selection<
    SVGElement,
    {},
    HTMLElement,
    any
  >;
  const confIntLayer = g.select(".confInt");
  const trendLineLayer = g.select(".trendLine");

  const scatterBrushLayer = g.select(".brush");
  const yBrushLayer = select("#y-histogram .brush") as any;
  const xBrushLayer = select("#x-histogram .brush") as any;

  const makePlot = (transition = true) => {
    linearAxis(xAxisLayer, "x", xScale, transition);
    linearAxis(yAxisLayer, "y", yScale, transition);

    grid("x", xGridLayer, xScale, width, height, margin, transition);
    grid("y", yGridLayer, yScale, width, height, margin, transition);

    const regressionGenerator = regressionLoess()
      .x((d: { x: number }) => xScale(d.x))
      .y((d: { y: number }) => yScale(d.y))
      .bandwidth(0.2);

    const lineGenerator = line()
      .x((d) => d[0])
      .y((d) => d[1]);

    trendLineLayer
      .select("#trend")
      .classed(scatterStyles.trendLine, true)
      .datum(regressionGenerator(data))
      .join("path")
      .transition()
      .duration(transition ? 1000 : 0)
      .attr("d", lineGenerator);

    scatterLayer
      .selectAll("circle")
      .data(data, (d) => (d as ScatterDatum).id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("r", 0)
            .attr("cx", (d) => Math.random() * innerWidth * 2)
            .attr("cy", (d) => Math.random() * innerHeight * 2)
            .classed(scatterStyles.point, true)
            .on("click", async (event) => {
              const pointData = select(event.target).data() as { id: string }[];
              const id = pointData[0].id;
              const geom = await getFlatGeometry(id);
              setGeomFun(geom);
              setIdFun(id);
            }),
        (update) =>
          update
            .transition()
            .duration(transition ? 1300 : 0)
            .attr("r", circleRadius)
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y)),
        (exit) =>
          exit
            .transition()
            .duration(transition ? 1300 : 0)
            .attr("cx", (d) => Math.random() * innerWidth)
            .attr("cy", (d) => Math.random() * innerHeight)
            .attr("r", 0)
            .remove()
      );
  };

  // Function that is triggered when brushing is performed
  const selectPoints = ({ selection }: any) => {
    if (!selection) {
      points.classed(`selected ${scatterStyles.selected}`, false);
      return;
    }

    const x0 = xScale.invert(selection[0][0]),
      x1 = xScale.invert(selection[1][0]),
      y0 = yScale.invert(selection[0][1]),
      y1 = yScale.invert(selection[1][1]);
    const [xMin, xMax] = extent([x0, x1]) as number[];
    const [yMin, yMax] = extent([y0, y1]) as number[];
    points.classed(`selected ${scatterStyles.selected}`, (d) => {
      const datum = d as ScatterDatum;
      const isSelected =
        xMin <= datum.x &&
        datum.x <= xMax &&
        yMin <= datum.y &&
        datum.y <= yMax;

      return isSelected;
    });
  };

  const getSelectedIds = ({ selection }: any) => {
    if (!selection) return;
    selectedIDs = [];
    selectAll("circle.selected").each((d) =>
      selectedIDs.push((d as ScatterDatum).id)
    );
  };
  const setZoom = (axis: "x" | "y", { selection }: any) => {
    if (!selection) return;
    const bars = selectAll(`#${axis}-histogram .bars rect`);

    let origScale: d3.ScaleLinear<number, number, never>;
    let scale: d3.ScaleLinear<number, number, never>;
    if (axis === "x") {
      scale = xScale;
      origScale = origXScale;
    } else {
      scale = yScale;
      origScale = origYScale;
    }

    const brushExtent = extent(
      selection.map(origScale.invert)
    ) as unknown as number[];
    bars.classed(histStyles.inactive, (d) => {
      const datum = d as { x0: number; x1: number };
      return datum.x1 < brushExtent[0] || datum.x0 > brushExtent[1];
    });
    scale.domain(brushExtent);
    makePlot(false);
  };

  const clearZoom = (axis: "x" | "y", { selection }: any) => {
    if (selection) return;

    const bars = selectAll(`#${axis}-histogram .bars rect`);
    let origScale: d3.ScaleLinear<number, number, never>;
    let scale: d3.ScaleLinear<number, number, never>;
    if (axis === "x") {
      scale = xScale;
      origScale = origXScale;
    } else {
      scale = yScale;
      origScale = origYScale;
    }
    bars.classed(histStyles.inactive, false);
    const domainUpdate = origScale.domain();
    scale.domain(domainUpdate);
    makePlot();
  };

  const xScale = linearScale("x", extent, data, "x", width, circleRadius);
  const yScale = linearScale("y   ", extent, data, "y", height, circleRadius);
  const origXScale = linearScale("x", extent, data, "x", width, circleRadius);
  const origYScale = linearScale("y", extent, data, "y", height, circleRadius);

  scatterBrushLayer.call(
    brush() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("brush", selectPoints)
      .on("end", getSelectedIds)
  );
  const xBrush = brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, (height + margin.top) * 0.2 - margin.bottom * 0.8],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("brush", (event) => setZoom("x", event))
    .on("end", (event) => clearZoom("x", event));

  xBrushLayer.call(xBrush);

  const yBrush = brushY() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [(width + margin.right) * 0.2 - margin.left * 0.8, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("brush", (event) => setZoom("y", event))
    .on("end", (event) => clearZoom("y", event));

  yBrushLayer.call(yBrush);

  // clear brushes on var change / filter
  xBrushLayer.call(xBrush.clear);
  yBrushLayer.call(yBrush.clear);
  makePlot();

  // for brushing function
  const points = scatterLayer.selectAll("circle");
}

export const updateHistogram = (
  data: {
    id: string;
    x: number;
  }[],
  props: {
    selector: string;
    width: number;
    height: number;
    margin: { [key: string]: number };
    axisOffset: number;
  }
) => {
  const { selector, width, height, margin, axisOffset } = props;
  const g = select<SVGElement, {}>(selector);
  const histogramLayer = g.select<SVGElement>(".bars");
  const xAxisLayer = g.select<SVGElement>("#x-axis");
  const yAxisLayer = g.select<SVGElement>("#y-axis");
  const xGridLayer = g.select<SVGElement>("#x-grid");
  const yGridLayer = g.select<SVGElement>("#y-grid");

  // set the parameters for the histogram
  const histogram = bin().value((d) => d.x); // I need to give the vector of value

  const binThresholds = (
    scale: d3.ScaleLinear<number, number, never>,
    nBins: number
  ) => {
    const limits = scale.domain();
    const step = (limits[1] - limits[0]) / nBins;
    return range(nBins).map((i) => limits[0] + i * step);
  };
  // binThresholds
  if (selector === "#y-histogram") {
    const xScale = scaleLinear().range([0, width]);
    const yScale = linearScale("y", extent, data, "x", height, axisOffset);
    // linearAxis(yAxisLayer, "y", yScale)

    histogram
      .domain(yScale.domain() as [number, number]) // then the domain of the graphic
      .thresholds(binThresholds(yScale, 70)); // then the numbers of bins

    const bins = histogram(data);

    xScale.domain([
      0,
      max(bins, function (d) {
        return d.length;
      }) as number,
    ]);
    linearAxis(xAxisLayer, "x", xScale, true, 4);

    grid("x", xGridLayer, xScale, width, height, margin, true, 4);

    histogramLayer
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 0)
      .attr("y", -14) // magic number to offset bars vertically
      .attr("transform", function (d) {
        return `translate(0, ${yScale(d.x0 as number)})`;
      })
      .classed(histStyles.bar, true);

    histogramLayer
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .transition()
      .duration(1000)
      .attr("height", function (d) {
        return yScale(d.x0 as number) - yScale(d.x1 as number);
      })
      // .attr("x", function(d) { return xScale(d.length); })
      .attr("width", function (d) {
        return xScale(d.length);
      });
  } else if (selector === "#x-histogram") {
    const xScale = linearScale("x", extent, data, "x", width, axisOffset);
    linearAxis(xAxisLayer, "x", xScale);
    // Y axis: scale and draw:
    const yScale = scaleLinear().range([0, height]);

    histogram
      .domain(xScale.domain() as [number, number]) // then the domain of the graphic
      .thresholds(binThresholds(xScale, 70)); // then the numbers of bins

    const bins = histogram(data);

    yScale.domain([
      0,
      max(bins, function (d) {
        return d.length;
      }) as number,
    ]);
    linearAxis(yAxisLayer, "y", yScale, true, 5);

    grid("y", yGridLayer, yScale, width, height, margin, true, 5);

    histogramLayer
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 1)
      .attr("y", 0)
      .attr("transform", function (d) {
        return `translate(${xScale(d.x0 as number)})`;
      })
      .classed(histStyles.bar, true);

    histogramLayer
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .transition()
      .duration(1000)
      .attr("width", function (d) {
        return xScale(d.x1 as number) - xScale(d.x0 as number) - 1;
      })
      .attr("height", function (d) {
        return yScale(d.length);
      });
  }
};

export function updateParallelCoord(
  data: { [key: string]: number }[], // & {id: string}[],
  activeColumns: string[],
  props: {
    selector: string;
    width: number;
    height: number;
    margin: { [key: string]: number };
  }
) {
  const nData = data.length;

  const { selector, width, height, margin } = props;
  const g = select(selector);
  let selectedIDs: string[] = [];
  const pathsLayer = g.select(`.${parallelStyles.paths}`);
  const yAxesLayer = g.select("#y-axes") as d3.Selection<
    SVGElement,
    {},
    HTMLElement,
    any
  >;

  const yAxes: {
    [key: string]: d3.Selection<SVGElement, {}, HTMLElement, any>;
  } = {};
  activeColumns.forEach((c) => (yAxes[c] = yAxesLayer.select(`#${c}`)));

  // a map that holds any active brush per attribute
  let activeBrushes = new Map();
  let allLines = pathsLayer
    .selectAll("path")
    .data(data, (d) => (d as { id: string } & { [key: string]: number }).id)
    .join("path");
  const makePlot = (transition = true) => {
    for (let c of activeColumns) {
      const myAxis = axisLeft(yScales.get(c));
      myAxis.ticks(10);

      if (transition) {
        yAxes[c]
          .transition()
          .duration(500)
          .attr("stroke-opacity", 1)
          .attr("fill-opacity", 1)
          .attr("transform", "translate(" + xScale(c) + ", 0)")
          .call(myAxis as any);
      } else {
        yAxes[c]
          .attr("stroke-opacity", 1)
          .attr("fill-opacity", 1)
          .attr("transform", "translate(" + xScale(c) + ", 0)")
          .call(myAxis as any);
      }
    } // for

    const brushes = yAxesLayer
      .selectAll(".coordinate-axis")
      .data(activeColumns)
      .join("g")
      .append("g")
      .classed("brush", true)
      .call(
        brushY()
          .extent([
            [-25, 0],
            [15, height],
          ])
          .on("brush", brushed)
          .on("end", brushEnd)
      );

    // Draw the lines
    if (transition) {
      allLines
        .transition()
        .duration(500)
        .attr("d", (d: { [key: string]: number | string }) =>
          line()(
            activeColumns.map((p) => [
              xScale(p) as number,
              yScales.get(p)(d[p]),
            ])
          )
        );
    } else {
      allLines.attr("d", (d: { [key: string]: number | string }) =>
        line()(
          activeColumns.map((p) => [xScale(p) as number, yScales.get(p)(d[p])])
        )
      );
    } // else
  }; // makePlot()

  function updateBrushing() {
    if (activeBrushes === null) {
      allLines.classed(parallelStyles.hidden, false);
    }
    const filterArray: string[] = [];
    for (const [column, value] of activeBrushes as Map<
      string,
      [number, number]
    >) {
      const extent = value.map((v) => yScales.get(column).invert(v));
      filterArray.push(
        `d.${column} > ${extent[0]} || d.${column} < ${extent[1]}`
      );
    }
    const filter = filterArray.join(" || ");

    allLines.classed(parallelStyles.hidden, (d) => eval(filter));
    const lineContainer = document.querySelector(`.${parallelStyles.paths}`);
    lineContainer
      ?.querySelectorAll(`path:not(.${parallelStyles.hidden})`)
      .forEach((l) => lineContainer.appendChild(l));
  } // updateBrushing()

  function brushed(
    { selection }: { selection: any },
    column: string,
    transition = nData < 1000
  ) {
    activeBrushes.set(column, selection);
    if (transition) updateBrushing();
  }

  function brushEnd({ selection }: { selection: any }, column: string) {
    if (selection === null) activeBrushes.delete(column);
    updateBrushing();
  }

  // Build the X scale to find the best position for each Y axis
  const xScale = scalePoint()
    .range([0, width])
    .padding(1)
    .domain(activeColumns);

  const yScales = (() => {
    let scales = new Map();

    activeColumns.forEach((c) => {
      let scaleValue: d3.ScaleLinear<number, number, never>;
      // Construct continuous linear scale where input data (domain) maps to specified output range.
      scaleValue = linearScale("y", extent, data, c, height).nice();
      scales.set(c, scaleValue);
    });
    return scales;
  })();

  yAxesLayer.selectAll(".brush").remove();
  makePlot(nData < 1000);
  updateBrushing();
}
