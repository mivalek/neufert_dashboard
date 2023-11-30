'use client'
import React from 'react';
import { useDataContext } from '@/contexts/data-context'

import { makeLabel } from '@/functions/make-label';

export const Dropdown = ({id}:{id: string}) => {
    
    const { varRanges, variables, setVariables } = useDataContext();
  const onSelectedValueChange = ({id, value}:{id: string, value: string}) => {
    setVariables(prevState  => {
        return {
        ...prevState,
        [id]: value
    }})
  }

  const options = Object.keys(varRanges).map((v: string) => ({value: v, label: makeLabel(v)}))

  return (
    <select
      id={id}
      defaultValue={variables[id as keyof typeof variables]}
      onChange={event => onSelectedValueChange(event.target)}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
)};