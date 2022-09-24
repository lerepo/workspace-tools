import React from 'react';
import {
  Checkbox,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import { Workspace } from '@/model/workspace';

export type SimpleWorkspaceListItemProps = {
  workspace: Workspace;
  selected: boolean;
  onSelectionChange: (path: string, selected: boolean) => void;
};

export const SimpleWorkspaceListItem: React.FC<
  SimpleWorkspaceListItemProps
> = ({ workspace, selected, onSelectionChange }) => {
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(workspace.location, event.target.checked);
  };

  const labelId = `workspace-list-label-${workspace.location}`;
  console.log(`item ${workspace.location} render: selected=${selected}`);
  return (
    <ListItem button>
      <ListItemText
        id={labelId}
        primary={workspace.location}
        primaryTypographyProps={{ noWrap: true }}
      />
      <ListItemSecondaryAction>
        <Checkbox
          disableRipple
          color="primary"
          edge="end"
          onChange={handleToggle}
          checked={selected}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
