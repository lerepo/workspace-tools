import React from 'react';

import { useListWorkspaces } from '@/hooks/api/use-list-workspaces';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import { WorkspaceList } from './components/workspace-list';

const useStyles = makeStyles({
  spinner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const ExplorePage: React.FC = () => {
  const classes = useStyles();
  const { status, data, error } = useListWorkspaces();

  return (
    <>
      {status === 'idle' ||
        (status === 'pending' && (
          <Box className={classes.spinner}>
            <CircularProgress />
          </Box>
        ))}
      {status === 'error' && <div>{JSON.stringify(error)}</div>}
      {status === 'success' && <WorkspaceList data={data} />}
    </>
  );
};
