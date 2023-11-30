'use client'
import React, {useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox  from '@mui/material/Checkbox';
import { Switch } from '@mui/material';

import { useDataContext } from '@/contexts/data-context'
import { makeLabel } from '@/functions/make-label';
export function SelectSwitches() {
    
  const { selectedColumns, setSelectedColumns } = useDataContext();
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    setSelectedColumns(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <FormGroup sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr"
      }}>
        {Object.keys(selectedColumns).map(v => <FormControlLabel key={v} control={
          <Switch 
            checked={selectedColumns[v]}
            onChange={handleChange}
            // sx={{
            //   color: "var(--font-col) ",
            // }}
            name={v}
          />
        } label={makeLabel(v)} />)}
    </FormGroup>
  )
}
