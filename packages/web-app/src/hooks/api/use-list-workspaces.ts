// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useMemo, useState } from 'react';
import { useAsyncApi, Status } from './use-async-api';
import axios, { AxiosTransformer, AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';
import { Workspace } from '~/model/workspace';
import { TEST_DATA } from './test-data';

const transformResponse = (data: string): Workspace[] => {
  const jsonRows = data.split(/\n|\n\r/).filter(Boolean);
  const workspaces: Workspace[] = [];
  const dependenctsMap = new Map<string, string[]>();
  jsonRows.map((row) => {
    console.log(row);
    const jsonRow = JSON.parse(row);
    const workspace = {
      location: jsonRow.location,
      name: jsonRow.name,
      dependencies: jsonRow.workspaceDependencies,
      mismatchedDependencies: jsonRow.mismatchedDependencies,
      dependents: [] // will be updated later
    };
    workspaces.push(workspace);
    // Update the dependents map
    jsonRow.workspaceDependencies.map((location) => {
      const dependents = dependenctsMap.get(location) || [];
      dependents.push(jsonRow.location);
      dependenctsMap.set(location, dependents);
    });
  });
  // Update workspaces dependents
  workspaces.map((workspace) => {
    const dependents = dependenctsMap.get(workspace.location);
    dependents && (workspace.dependents = dependents);
  });
  return _.sortBy(workspaces, 'location');
};

export const useListWorkspaces = (): { status: Status; data: Workspace[]; error: unknown } => {
  let result;
  if (APP_IS_PRODUCTION) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const options = useMemo<AxiosRequestConfig>(
      () => ({
        responseType: 'text',
        transformResponse: [
          transformResponse,
          ...(axios.defaults.transformResponse as AxiosTransformer[])
        ]
      }),
      []
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result = useAsyncApi('/api/deps', options);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [result] = useState({
      status: 'success',
      data: transformResponse(TEST_DATA),
      error: undefined
    });
  }
  return { status: result.status as Status, data: result.data as Workspace[], error: result.error };
};
