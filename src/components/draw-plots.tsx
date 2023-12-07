"use client";
import { useEffect, useState } from "react";
import { useDataContext } from "@/contexts/data-context";
import { randomLcg, range, shuffler } from "d3";

import { Slider } from "@mui/material";
import Box from "@mui/material/Box";

import {
  updateScatterPlot,
  updateHistogram,
  updateParallelCoord,
} from "@/components/update-plots";
// import { addInteractivity } from "./floorplan_viewer/add-interactivity";

export function DrawScatterPlot(props: {
  selector: string;
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  circleRadius: number;
}) {
  const { filteredData, dataFilter, variables, setGeometry, setSelectedId } =
    useDataContext();
  const plotData = filteredData.map((d) => ({
    id: d.id,
    x: d[variables.xVar],
    y: d[variables.yVar],
  }));
  useEffect(
    () => updateScatterPlot(plotData, props, setGeometry, setSelectedId),
    [variables, dataFilter]
  ); // for some reason using plotData re-renders on scatter point click

  return false;
}

export function DrawHistogram(props: {
  selector: string;
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  axisOffset: number; // to match scatterplot axis offset by circle radius
}) {
  const { filteredData, variables } = useDataContext();
  const variable =
    props.selector === "#y-histogram" ? variables.yVar : variables.xVar;
  const plotData = filteredData.map((d) => ({
    id: d.id,
    x: d[variable],
  }));

  useEffect(() => {
    updateHistogram(plotData, props);
  }, [plotData]);

  return false;
}

export function DrawParallelCoord(props: {
  selector: string;
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}) {
  const seed = 420;
  const marks = [
    {
      value: 0.2,
      label: "20%",
    },
    {
      value: 0.4,
      label: "40%",
    },
    {
      value: 0.6,
      label: "60%",
    },
    {
      value: 0.8,
      label: "80%",
    },
    {
      value: 1,
      label: "100%",
    },
  ];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const { filteredData, selectedColumns } = useDataContext();
  const nData = filteredData.length;
  const defaultPerc = 0.25;

  const [percentage, setPercentage] = useState(defaultPerc);
  let idx = shuffler(randomLcg(seed))(range(nData));
  idx = idx.slice(0, Math.floor(nData * percentage));
  let plotData = idx.map((i) => filteredData[i]);

  useEffect(() => {
    updateParallelCoord(
      plotData,
      Object.keys(selectedColumns).filter((c) => selectedColumns[c]),
      props
    );
  }, [plotData, selectedColumns]);

  const handleChangeEnd = (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    const val = value as number;
    setPercentage(val);
  };
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Always visible"
        min={0.2}
        max={1}
        defaultValue={defaultPerc}
        getAriaValueText={valuetext}
        step={0.001}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value: number) => `N = ${Math.floor(value * nData)}`}
        onChangeCommitted={handleChangeEnd}
      />
    </Box>
  );
}
