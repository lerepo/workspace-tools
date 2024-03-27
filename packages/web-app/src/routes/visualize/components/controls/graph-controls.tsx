import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { SimpleWorkspaceList } from './simple-workspace-list';
import { Workspace } from '@/model/workspace';

export const GraphControls: React.FC<{
  data: Workspace[];
  onSelectionUpdate: (selection: string[]) => void;
}> = ({ data, onSelectionUpdate }) => {
  const [filter, setFilter] = useState('');

  const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`apply filter: ${event.target.value}`);
    setFilter(event.target.value);
  };

  return (
    <Box sx={{
      width: '100%',
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <TextField
        key="filter-text-field"
        sx={{
          margin: '12px',
          width: 'auto',
          flexShrink: 0
        }}
        label="Filter"
        placeholder="start typing..."
        InputLabelProps={{
          shrink: true
        }}
        onChange={applyFilter}
      />
      <SimpleWorkspaceList
        workspaces={data.filter((item) => item.location?.includes(filter))}
        onSelectionUpdate={onSelectionUpdate}
      />
    </Box>
  );
};
