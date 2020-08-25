export type PackageManagerName = 'npm' | 'pnpm' | 'yarn';
export interface PackageManager {
  readonly name: PackageManagerName;
  readonly version: string;
  readonly workspaces: boolean;
}
