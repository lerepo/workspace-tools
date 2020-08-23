import React, { useEffect, useCallback, useState } from 'react';

import { ForceGraph, GraphControls } from '~/routes/visualize/components';
import { CircularProgress, makeStyles, Box } from '@material-ui/core';

import { Workspace } from '~/model/workspace';
import { useAppDrawer } from '~/contexts/use-app-drawer';
import { useListWorkspaces } from '~/hooks/api/use-list-workspaces';

const useStyles = makeStyles({
  spinner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const VisualizePage: React.FC = () => {
  const classes = useStyles();
  const [selection, setSelection] = useState<string[]>([]);
  const drawer = useAppDrawer();
  const { status, data, error } = useListWorkspaces();

  const onSelectionUpdate = useCallback((newSelection: string[]) => {
    console.log(`VisualizePage selection update: ${newSelection}`);
    setSelection(newSelection);
  }, []);

  useEffect(() => {
    if (drawer && data) {
      drawer.removeExtension('visualize-page');
      drawer.addExtension(
        'visualize-page',
        <GraphControls
          key="visualize-graph-controls"
          data={data as Workspace[]}
          onSelectionUpdate={onSelectionUpdate}
        />
      );
      drawer.show();
      return () => {
        drawer && drawer.removeExtension('visualize-page');
      };
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {status === 'idle' ||
        (status === 'pending' && (
          <Box className={classes.spinner}>
            <CircularProgress />
          </Box>
        ))}
      {status === 'error' && <div>{JSON.stringify(error)}</div>}
      {status === 'success' && <ForceGraph data={data as Workspace[]} selection={selection} />}
    </>
  );
};
