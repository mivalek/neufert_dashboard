import {useRef, useEffect } from 'react';
import { select } from 'd3';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef();

    useEffect(() => {
        renderChartFn(select(ref.current));
        return () => {};
      }, dependencies);

    return ref;
}