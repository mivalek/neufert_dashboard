'use client'

import {useState} from 'react';
import { rollup } from 'd3';
import BarChart from './plot';
import { Dropdown } from '../dropdown';
import styles from '../styles.module.css';

const getData = (data: {[key: string]: any}[], variable: string) => {
  const varCountsRollup = rollup(data, D => D.length, d => Math.round(d[variable]));
  const varCounts = Array.from(varCountsRollup, ([group, count]) => ({
    group, count }))
  varCounts.sort((a, b) => a.group - b.group); 
  return varCounts
}

// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
const makeLabel = (string: string) => {
  return (string.charAt(0).toUpperCase() + string.slice(1)).replaceAll("_", " ");
}

const margin = {top: 30, right: 30, bottom: 30, left: 60};

function BarChartContainer({
  data,
  variables,
  width,
  height,
  searchParams
}:{
  data: {[key: string]: any}[]
  variables: string[]
  width: number
  height: number
  searchParams: URLSearchParams
}) {

  if (!data) {
    return <div className='loading'>Loading...</div>;
  }

  const innerWidth: number = width - margin.left - margin.right;
  const innerHeight: number = height - margin.top - margin.bottom;

  const dropdownMenu = variables.map((v: string) => ({value: v, label: makeLabel(v)}))
  
  const initialVar = variables[0]
  const [xVar, setXVar] = useState(initialVar);
  
  let countData = getData(data, xVar);

  return (
    <div id="barchart" className={styles.plotGrid}>
      <svg className={styles.plot} width={width} height={height}>
        <BarChart
          data={countData}
          width={innerWidth}
          height={innerHeight}
          margin={margin}
        />
      </svg>
      <div className={styles.col2}>
        <Dropdown
          options={dropdownMenu}
          id={"barvar"}
          selectedValue={xVar}
          // onSelectedValueChange={setXVar}
        />
      </div>
    </div>
  )
}

export default BarChartContainer