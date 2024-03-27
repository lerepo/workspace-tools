import React, { useState } from 'react';
import { Workspace } from '@/model/workspace';
import { List, Box, Hidden } from '@mui/material';
import { WorkspaceListItem } from './workspace-list-item';
import { WorkspaceDetails } from './workspace-details';

export const WorkspaceList: React.FC<{ data: Workspace[] }> = ({ data }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    data.length > 0 ? data[0] : null
  );

  const handleItemClicked = (workspace: Workspace): void => {
    setSelectedWorkspace(workspace);
  };

  return (
    <Box sx={{
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <List sx={{
        flex: '1 1 0',
        height: 'calc(100vh - 64px)',
        overflow: 'auto'
      }}>
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
          <Box sx={{
            minWidth: '300px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            <WorkspaceDetails workspace={selectedWorkspace} />
          </Box>
        </Hidden>
      )}
    </Box>
  );
};
