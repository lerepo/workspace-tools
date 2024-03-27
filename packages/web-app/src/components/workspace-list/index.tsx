import React from 'react';
import { Box } from '@mui/material';

export type WorkspaceListProps = {
  data: string;
};

export const WorkspaceList: React.FC<WorkspaceListProps> = ({ data }) => {
  return <Box>Workspace List: {JSON.stringify(data)}</Box>;
};
