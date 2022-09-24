import React, { useState } from 'react';
import { TextField, makeStyles, Box } from '@material-ui/core';
import { SimpleWorkspaceList } from './simple-workspace-list';
import { Workspace } from '@/model/workspace';

const useStyles = makeStyles({
  root: {
    width: '100%',
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column'
  },
  filter: {
    margin: '12px',
    width: 'auto',
    flexShrink: 0
  }
});

export const GraphControls: React.SFC<{
  data: Workspace[];
  onSelectionUpdate: (selection: string[]) => void;
}> = ({ data, onSelectionUpdate }) => {
  const classes = useStyles();
  const [filter, setFilter] = useState('');

  const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`apply filter: ${event.target.value}`);
    setFilter(event.target.value);
  };

  return (
    <Box className={classes.root}>
      <TextField
        key="filter-text-field"
        className={classes.filter}
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
