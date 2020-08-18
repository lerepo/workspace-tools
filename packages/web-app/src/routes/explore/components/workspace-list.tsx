import React, { useState } from 'react';
import { Workspace } from '~/model/workspace';
import { makeStyles, List, Box, Hidden } from '@material-ui/core';
import { WorkspaceListItem } from './workspace-list-item';
import { WorkspaceDetails } from './workspace-details';

const useStyles = makeStyles({
  root: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'row'
  },
  list: {
    flex: '1 1 0',
    // margin: '1rem',
    // TODO: adjust based on breakpoint when header is only 56px
    height: 'calc(100vh - 64px);',
    overflow: 'auto'
  },
  details: {
    minWidth: '300px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    // TODO: adjust based on breakpoint when header is only 56px
    height: 'calc(100vh - 64px);',
    overflow: 'auto'
  }
});

export const WorkspaceList: React.FC<{ data: Workspace[] }> = ({ data }) => {
  const classes = useStyles();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    data.length > 0 ? data[0] : null
  );

  const handleItemClicked = (workspace: Workspace): void => {
    setSelectedWorkspace(workspace);
  };

  return (
    <Box className={classes.root}>
      <List className={classes.list}>
        {data.map((item) => (
          <WorkspaceListItem
            key={item.location}
            workspace={item}
            selected={item.location === selectedWorkspace?.location}
            onClick={handleItemClicked}
          />
        ))}
      </List>
      {selectedWorkspace && (
        <Hidden smDown>
          <Box className={classes.details}>
            <WorkspaceDetails workspace={selectedWorkspace} />
          </Box>
        </Hidden>
      )}
    </Box>
  );
};
