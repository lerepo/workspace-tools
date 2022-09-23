import { execa } from 'execa';
import semver from 'semver';

import { PackageManager, PackageManagerName } from '~/package-manager';

export class InstalledPackageManagerLocator implements PackageManager {
  private _detectionDone = false;
  private _error: string | null = null;
  private _version: string | null = null;

  constructor(public name: PackageManagerName) {}

  get error(): string | null {
    return this._error;
  }
  get workspaces(): boolean {
    return (
      this._version !== null &&
      (this.name === 'yarn' || (this.name === 'pnpm' && semver.gte(this._version, '3.7.0')))
    );
  }
  get version(): string {
    if (this._detectionDone) {
      if (this._version !== null) return this._version;
      else throw new Error(`${this.name} is not installed`);
    } else throw new Error(`call detect() before accessing the PackageManager version`);
  }

  /**
   * If the pm we are looking for is yarn and the project has been setup with
   * yarn berry (v2), yarn executable will always resolveto the locally
   * installed version in the project if there is one. This means that the
   * detected version will not be the global version.
   */
  async detect(): Promise<void> {
    if (!this._detectionDone) {
      try {
        this._detectionDone = true;
        const { stdout } = await execa(this.name, ['--version']);
        this._version = semver.clean(stdout);
        if (this._version === null)
          this._error = `command '${this.name} --version' produced output '${stdout}, which is not a valid semantic version`;
      } catch (error) {
        if (error instanceof Error) this._error = error.message;
        else this._error = 'unknown error';
      }
    }
  }
}

export const has = async (name: PackageManagerName): Promise<PackageManager | null> => {
  const pm = new InstalledPackageManagerLocator(name);
  await pm.detect();
  if (!pm.error) return pm;
  else {
    if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
      console.info(`Detection of ${pm.name} failed with error: ${pm.error}`);
    }
    return null;
  }
};
