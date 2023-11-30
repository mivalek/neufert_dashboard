'use client'
import React, { useState } from 'react'

import { useDataContext } from '@/contexts/data-context'
import { RangeSlider } from './range-slider'
import { makeLabel } from '@/functions/make-label'

import styles from '@/components/styles.module.css'

export function SliderGroup() {
    const { varRanges, variables } = useDataContext()
    const selectedVars = Object.values(variables);
  return (
    <div className={styles.filters}>
        <h2>Filters</h2>
        <div className={styles.sliderContainer}>
        {
            Object.keys(varRanges)
                .filter(k => !selectedVars.includes(k))
                .map(k => (
                  <div key={k}>
                    <div>{makeLabel(k)}</div>
                    <RangeSlider
                      variable={k}
                    />
                  </div>
                )
            )
        }
        </div>
    </div>

  )
}
