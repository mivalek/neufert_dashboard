'use client'
import React from 'react';
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';



export const Dropdown = ({
  options, id, selectedValue
}:{
  options: {
    value: string
    label: string
  }[]
  id: string
  selectedValue: string
}) => {

  const router = useRouter();
  const searchParams = useSearchParams()
  const onSelectedValueChange = ({id, value}:{id: string, value: string}) => {
    const params: {[key: string]: string} = {}
    
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    params[id] = value
    
    const newParamString = "?" + Object.keys(params).map(k => k + "=" + params[k]).join("&")
    
    router.push(newParamString)
  }

  return (
    <select
      id={id}
      defaultValue={selectedValue}
      onChange={event => onSelectedValueChange(event.target)}>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
)};