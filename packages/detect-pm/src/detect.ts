import * as ppath from 'path';
import * as _ from 'lodash';

import {
  findPackageManagerFromManifest,
  findPackageManagerFromSignatureFiles
} from '@/internals/find-pm';

import { PackageManager, PackageManagerName } from '@/package-manager';
import { detectInstalledPackageManagers } from '@/detect-installed';

export type DetectionOptions = {
  cwd?: string;
  installedPackageManagers?: PackageManager[];
  preference?: PackageManagerName[];
};

export const detectPackageManagers = async (
  options?: DetectionOptions
): Promise<PackageManager | null> => {
  const cwd = options && options.cwd ? options.cwd : process.cwd();
  const installedPackageManagers =
    options && options.installedPackageManagers
      ? options.installedPackageManagers
      : await detectInstalledPackageManagers();
  const preference = _.uniq([
    ...(options && options.preference ? options.preference : []),
    'yarn',
    'pnpm',
    'npm'
  ]);

  let found =
    findPackageManagerFromManifest(cwd, installedPackageManagers) || [];
  if (found.length === 0) {
    found =
      findPackageManagerFromSignatureFiles(cwd, installedPackageManagers) || [];
  }

  if (found.length === 0) {
    // Go down one level and try again
    const parent = ppath.dirname(cwd);
    if (parent !== '.' && parent !== cwd) {
      return detectPackageManagers({
        cwd: parent,
        installedPackageManagers,
        preference
      });
    }
  }

  if (found.length > 1) {
    // Filter the results based on the preference
    for (const pref of preference) {
      const matched = found.find((pm) => pm.name === pref);
      if (matched) return matched;
    }
    // Should not happen
  }
  return found.length > 0 ? found[0] : null;
};
