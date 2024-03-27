import React, { useCallback, useReducer, useEffect, useState } from 'react';
import {
  List,
  Checkbox,
  Box,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { SimpleWorkspaceListItem } from './simple-workspace-list-item';
import * as _ from 'lodash';

import { Workspace } from '@/model/workspace';

type State = {
  selection: string[];
};

const initialState = (workspaces: Workspace[]): State => {
  console.log(`SimpleWorkspaceList initial state init`);
  return {
    selection: workspaces.map((item) => item.location)
  };
};

const ITEMS_SELECTED_ACTION = 'add items to selection';
const ITEMS_UNSELECTED_ACTION = 'remove items from selection';

type ActionBaseType = {
  type: typeof ITEMS_SELECTED_ACTION | typeof ITEMS_UNSELECTED_ACTION;
  items: string[];
};

type ItemSelectedActionType = ActionBaseType;

type ItemUnselectedActionType = ActionBaseType;

type ActionType = ItemSelectedActionType | ItemUnselectedActionType;

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case ITEMS_SELECTED_ACTION: {
      return {
        selection: _.union(action.items, state.selection)
      };
    }
    case ITEMS_UNSELECTED_ACTION: {
      return {
        selection: _.without(state.selection, ...action.items)
      };
    }
    default:
      throw new Error();
  }
};

export type WorkspaceListProps = {
  workspaces: string[];
};

export const SimpleWorkspaceList: React.FC<{
  workspaces: Workspace[];
  onSelectionUpdate: (selection: string[]) => void;
}> = ({ workspaces, onSelectionUpdate }) => {
  const [state, dispatch] = useReducer(reducer, workspaces, initialState);
  const [multiSelectionState, setMultiSelectionState] = useState<
    'all' | 'none' | 'indeterminate' | 'disabled'
  >('indeterminate');

  const onItemSelectionChange = useCallback(
    (location: string, selected: boolean) => {
      const actionType = selected
        ? ITEMS_SELECTED_ACTION
        : ITEMS_UNSELECTED_ACTION;
      dispatch({ type: actionType, items: [location] });
    },
    []
  );

  useEffect(() => {
    console.log(`selection update: ${state.selection}`);
    onSelectionUpdate(state.selection);
  }, [onSelectionUpdate, state.selection]);

  useEffect(() => {
    if (workspaces.length > 0) {
      let selectedVisibleCount = 0;
      workspaces.map((visible) => {
        if (state.selection.includes(visible.location)) selectedVisibleCount++;
      });
      if (selectedVisibleCount === workspaces.length) {
        // All visible items in selection
        setMultiSelectionState('all');
      } else if (selectedVisibleCount === 0) {
        setMultiSelectionState('none');
      } else {
        setMultiSelectionState('indeterminate');
      }
    } else {
      setMultiSelectionState('disabled');
    }
  }, [state, workspaces]);

  const handleMultiSelectToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(`multi-selection toggle: ${event.target.checked}`);
    const actionType =
      multiSelectionState === 'indeterminate' || multiSelectionState === 'none'
        ? ITEMS_SELECTED_ACTION
        : ITEMS_UNSELECTED_ACTION;
    dispatch({
      type: actionType,
      items: workspaces.map((item) => item.location)
    });
  };

  console.log(`workspaces list: ${workspaces.length}`);
  return (
    <Box sx={{width: '100%', flex: '1 1 0'}}>
      <List dense>
        <ListItem key={'multi-select-checkbox'}>
          <ListItemText primary="&nbsp;" />
          <ListItemSecondaryAction>
            <Checkbox
              disableRipple
              color="primary"
              edge="end"
              disabled={multiSelectionState === 'disabled'}
              checked={multiSelectionState === 'all'}
              indeterminate={multiSelectionState === 'indeterminate'}
              onChange={handleMultiSelectToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {workspaces.map((item) => (
          <SimpleWorkspaceListItem
            key={item.location}
            workspace={item}
            selected={
              state.selection.findIndex(
                (location) => item.location === location
              ) !== -1
            }
            onSelectionChange={onItemSelectionChange}
          />
        ))}
      </List>
    </Box>
  );
};
