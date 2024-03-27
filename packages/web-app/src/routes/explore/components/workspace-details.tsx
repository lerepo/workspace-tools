import React from 'react';
import {
  Card,
  CardContent,
  ListItem,
  ListItemText,
  List,
  Box,
  Typography
} from '@mui/material';
import { Workspace } from '@/model/workspace';

export const WorkspaceDetails: React.FC<{ workspace: Workspace }> = ({
  workspace
}) => {
  return (
    <Box sx={{ padding: '1rem' }}>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardContent>
          <Typography component="h6" variant="h6">
            {workspace.dependencies.length > 0
              ? 'Depends on'
              : 'No dependencies'}
          </Typography>
          {workspace.dependencies.length > 0 && (
            <List dense>
              {workspace.dependencies.map((dep) => (
                <ListItem key={dep}>
                  <ListItemText primaryTypographyProps={{ noWrap: true }}>
                    {dep}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
      {workspace.mismatchedDependencies?.length > 0 && (
        <Card sx={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography component="h6" variant="h6">
              Mismatched Dependencies
            </Typography>
            <List dense>
              {workspace.mismatchedDependencies.map((dep) => (
                <ListItem key={dep}>
                  <ListItemText primaryTypographyProps={{ noWrap: true }}>
                    {dep}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {workspace.dependents.length > 0 && (
        <Card sx={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography component="h6" variant="h6">
              Is a dependency of
            </Typography>
            <List dense>
              {workspace.dependents.map((dep) => (
                <ListItem key={dep}>
                  <ListItemText primaryTypographyProps={{ noWrap: true }}>
                    {dep}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
