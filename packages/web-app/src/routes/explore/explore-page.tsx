import React from 'react';

import { useListWorkspaces } from '@/hooks/api/use-list-workspaces';
import { Box, CircularProgress } from '@mui/material';
import { WorkspaceList } from './components/workspace-list';

export const ExplorePage: React.FC = () => {
  const { status, data, error } = useListWorkspaces();

  return (
    <>
      {status === 'idle' ||
        (status === 'pending' && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </Box>
        ))}
      {status === 'error' && <div>{JSON.stringify(error)}</div>}
      {status === 'success' && <WorkspaceList data={data} />}
    </>
  );
};
