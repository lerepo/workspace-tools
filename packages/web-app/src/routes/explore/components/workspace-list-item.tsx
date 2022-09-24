import React from 'react';
import { Workspace } from '@/model/workspace';
import { ListItem, ListItemText, Collapse, Hidden } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { WorkspaceDetails } from './workspace-details';

export const WorkspaceListItem: React.FC<{
  workspace: Workspace;
  selected: boolean;
  onClick: (workspace: Workspace) => void;
}> = ({ workspace, selected, onClick }) => {
  const handleClick = () => {
    onClick(workspace);
  };

  return (
    <>
      <ListItem button onClick={handleClick} selected={selected}>
        <ListItemText primary={workspace.location} secondary={workspace.name} />
        <Hidden mdUp>{selected ? <ExpandLess /> : <ExpandMore />}</Hidden>
      </ListItem>
      <Hidden mdUp>
        <Collapse in={selected} timeout="auto" unmountOnExit>
          <WorkspaceDetails workspace={workspace} />
        </Collapse>
      </Hidden>
    </>
  );
};
