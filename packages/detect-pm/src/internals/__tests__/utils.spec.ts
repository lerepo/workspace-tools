jest.mock('fs');
import * as fs from 'fs';
const mockedReadFileSync = <jest.MockedFunction<typeof fs.readFileSync>>fs.readFileSync;
const mockedExistsSync = <jest.MockedFunction<typeof fs.existsSync>>fs.existsSync;

import { findManifestInDirectory, checkPackageManagerFiles } from '~/internals/utils';

describe('findManifestInDirectory', () => {
  it('should return manifest content when found', () => {
    mockedReadFileSync.mockReturnValue('{ "name": "manifest"}');
    const manifest = findManifestInDirectory('__not_important__');
    expect(manifest).not.toBeNull();
    expect(manifest && manifest.engines).toBeUndefined();
    expect(manifest && manifest['name']).toEqual('manifest');
  });

  it('should return null when manifest is not found', () => {
    mockedReadFileSync.mockImplementationOnce(() => {
      throw { code: 'NOENT' };
    });
    const manifest = findManifestInDirectory('__not_important__');
    expect(manifest).toBeNull();
  });

  it('should return null when reading manifest fails for any error', () => {
    mockedReadFileSync.mockImplementationOnce(() => {
      throw { code: '__ANY_ERROR__' };
    });
    const manifest = findManifestInDirectory('__not_important__');
    expect(manifest).toBeNull();
  });

  it('should return null when manifest content is not valid JSON', () => {
    mockedReadFileSync.mockReturnValue('__invalid_json__');
    const manifest = findManifestInDirectory('__not_important__');
    expect(manifest).toBeNull();
  });
});

describe('checkPackageManagerFiles', () => {
  afterEach(() => {
    mockedExistsSync.mockReset();
  });

  it('should detect npm signature files', () => {
    mockedExistsSync.mockImplementation((path: string) => {
      return path.match(/package-lock\.json$/) ? true : false;
    });

    let result = checkPackageManagerFiles('__not_important__', 'npm');
    expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();

    // Only one file to look for
    mockedExistsSync.mockReset();
    const calledWith: string[] = [];
    const files = ['package-lock.json'];
    mockedExistsSync.mockImplementation((path: string) => {
      calledWith.push(path);
      return false;
    });

    result = checkPackageManagerFiles('__not_important__', 'npm');
    expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    files.map((file) => {
      expect(calledWith.find((value) => value.endsWith(file))).toBeTruthy();
    });
    expect(result).toBeFalsy();
  });

  it('should detect pnpm signature files', () => {
    mockedExistsSync.mockImplementation((path: string) => {
      return path.match(/(pnpm-lock\.yaml|pnpm-workspaces\.yaml|pnpmfile\.js)$/) ? true : false;
    });

    let result = checkPackageManagerFiles('__not_important__', 'pnpm');
    expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();

    // 3 files to look for
    mockedExistsSync.mockReset();
    const calledWith: string[] = [];
    const files = ['pnpm-lock.yaml', 'pnpm-workspaces.yaml', 'pnpmfile.js'];
    mockedExistsSync.mockImplementation((path: string) => {
      calledWith.push(path);
      return false;
    });
    result = checkPackageManagerFiles('__not_important__', 'pnpm');
    expect(mockedExistsSync).toHaveBeenCalledTimes(3);
    files.map((file) => {
      expect(calledWith.find((value) => value.endsWith(file))).toBeTruthy();
    });
    expect(result).toBeFalsy();
  });

  it('should detect yarn signature files', () => {
    mockedExistsSync.mockImplementation((path: string) => {
      return path.match(/(yarn\.lock|\.yarnrc\.yaml)$/) ? true : false;
    });

    let result = checkPackageManagerFiles('__not_important__', 'yarn');
    expect(mockedExistsSync).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();

    // 3 files to look for
    mockedExistsSync.mockReset();
    const calledWith: string[] = [];
    const files = ['yarn.lock', '.yarnrc.yml'];
    mockedExistsSync.mockImplementation((path: string) => {
      calledWith.push(path);
      return false;
    });
    result = checkPackageManagerFiles('__not_important__', 'yarn');
    expect(mockedExistsSync).toHaveBeenCalledTimes(2);
    files.map((file) => {
      expect(calledWith.find((value) => value.endsWith(file))).toBeTruthy();
    });
    expect(result).toBeFalsy();
  });

  it('should return false if called with an unknown pm', () => {
    const result = checkPackageManagerFiles('__not_important__', '__UNKNOWN__');
    expect(mockedExistsSync).toHaveBeenCalledTimes(0);
    expect(result).toBeFalsy();
  });
});
