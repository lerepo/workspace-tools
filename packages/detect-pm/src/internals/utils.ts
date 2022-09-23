import * as fs from 'fs';
import * as ppath from 'path';
import { Manifest } from './manifest';

export const findManifestInDirectory = (directory: string): Manifest | null => {
  const path = ppath.resolve(directory, 'package.json');
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = fs.readFileSync(path, { encoding: 'utf-8' });
    if (content) {
      const manifest = JSON.parse(content);
      return manifest as Manifest;
    }
  } catch (error) {
    if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING && error instanceof ErrnoException) {
      if (error.code !== 'ENOENT')
        console.warn(`attempt to read manifest at ${path} failed: ${error.message}`);
    }
  }
  return null;
};

const PACKAGE_MANAGERS_FILES = {
  npm: ['package-lock.json'],
  pnpm: ['pnpm-lock.yaml', 'pnpm-workspaces.yaml', 'pnpmfile.js'],
  yarn: ['yarn.lock', '.yarnrc.yml']
};

export const checkPackageManagerFiles = (directory: string, pm: string): boolean => {
  // If pm name is not known, bailout quickly
  if (!Object.keys(PACKAGE_MANAGERS_FILES).includes(pm)) {
    if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
      console.trace(`checking signature files for an unknown package manager '${pm}'`);
    }
    return false;
  }

  if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
    console.log(`checking for ${pm} files in ${directory}`);
  }

  for (const file of PACKAGE_MANAGERS_FILES[pm]) {
    const path = ppath.resolve(directory, file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.existsSync(path)) {
      if (ENV_IS_DEVELOPMENT && !ENV_IS_UNIT_TESTING) {
        console.log(`found ${pm} file ${file} in ${directory}`);
      }
      return true;
    }
  }
  return false;
};
