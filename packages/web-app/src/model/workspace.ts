export interface Workspace {
  location: string;
  name: string;
  dependencies: string[];
  mismatchedDependencies: string[];
  dependents: string[];
}
