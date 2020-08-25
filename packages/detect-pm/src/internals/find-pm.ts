import * as semver from 'semver';

import { findManifestInDirectory, checkPackageManagerFiles } from './utils';
import { PackageManager } from '~/package-manager';

const PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm'];

export const findPackageManagerFromManifest = (
  cwd: string,
  installedPackageManagers: PackageManager[]
): PackageManager[] => {
  if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
    console.log(`checking for manifest in ${cwd}`);
  }

  const found: PackageManager[] = [];

  // Find a manifest in the currrent directory, and if it has an 'engines'
  // property then try to match its requirements with the installed package
  // managers
  const manifest = findManifestInDirectory(cwd);
  if (manifest) {
    const engines = manifest.engines;
    if (engines) {
      for (const [engine, requirement] of Object.entries(engines).filter(([key]) =>
        PACKAGE_MANAGERS.includes(key)
      )) {
        const installed = installedPackageManagers.find(
          (pm) => pm.name === engine && semver.satisfies(pm.version, requirement)
        );
        installed && found.push(installed);
      }
    }
  }

  return found;
};

export const findPackageManagerFromSignatureFiles = (
  cwd: string,
  installedPackageManagers: PackageManager[]
): PackageManager[] => {
  const found: PackageManager[] = [];

  PACKAGE_MANAGERS.map((pm) => {
    if (checkPackageManagerFiles(cwd, pm)) {
      const installed = installedPackageManagers.find((item) => item.name === pm);
      if (installed) found.push(installed);
      else if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
        console.warn(`Project at ${cwd} has ${pm} files but ${pm} is not installed`);
      }
    }
  });

  return found;
};
