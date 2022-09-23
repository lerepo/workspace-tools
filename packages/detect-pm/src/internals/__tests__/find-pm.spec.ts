jest.mock('../utils', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../utils');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    findManifestInDirectory: jest.fn(),
    checkPackageManagerFiles: jest.fn()
  };
});
import { findManifestInDirectory, checkPackageManagerFiles } from '../utils';
const mockFindManifestInDirectory = <jest.MockedFunction<typeof findManifestInDirectory>>(
  findManifestInDirectory
);
const mockCheckPackageManagerFiles = <jest.MockedFunction<typeof checkPackageManagerFiles>>(
  checkPackageManagerFiles
);

import { PackageManager } from '../../package-manager';
import { findPackageManagerFromManifest, findPackageManagerFromSignatureFiles } from '../find-pm';

describe('findPackageManagerFromManifest', () => {
  it('should return pm if specified in engines and is installed', () => {
    const installed: PackageManager[] = [
      { name: 'npm', version: '1.0.0', workspaces: false },
      { name: 'yarn', version: '2.1.1', workspaces: true },
      { name: 'pnpm', version: '5.1.1', workspaces: true }
    ];

    mockFindManifestInDirectory.mockReturnValueOnce({
      engines: {
        npm: '>=1',
        pnpm: '>2'
      }
    });

    const found = findPackageManagerFromManifest('__not_important__', installed);
    expect(mockFindManifestInDirectory).toHaveBeenCalledWith('__not_important__');
    expect(found).toBeTruthy();
    expect(found.length).toEqual(2);
    expect(found.find((pm) => pm.name === 'npm')).toBeTruthy();
    expect(found.find((pm) => pm.name === 'pnpm')).toBeTruthy();
  });

  it('should not return a pm that is not installed', () => {
    const installed: PackageManager[] = [
      { name: 'yarn', version: '2.1.1', workspaces: true },
      { name: 'pnpm', version: '5.1.1', workspaces: true }
    ];

    mockFindManifestInDirectory.mockReturnValueOnce({
      engines: {
        npm: '>=1',
        pnpm: '>2'
      }
    });

    const found = findPackageManagerFromManifest('__not_important__', installed);
    expect(mockFindManifestInDirectory).toHaveBeenCalledWith('__not_important__');
    expect(found).toBeTruthy();
    expect(found.length).toEqual(1);
    expect(found.find((pm) => pm.name === 'pnpm')).toBeTruthy();
  });

  it('should not return any pm if manifest does not specify them in engines', () => {
    const installed: PackageManager[] = [
      { name: 'npm', version: '1.0.0', workspaces: false },
      { name: 'yarn', version: '2.1.1', workspaces: true },
      { name: 'pnpm', version: '5.1.1', workspaces: true }
    ];

    mockFindManifestInDirectory.mockReturnValueOnce({
      engines: {
        node: '>=12'
      }
    });

    let found = findPackageManagerFromManifest('__not_important__', installed);
    expect(mockFindManifestInDirectory).toHaveBeenCalledWith('__not_important__');
    expect(found).toBeTruthy();
    expect(found.length).toEqual(0);

    mockFindManifestInDirectory.mockReturnValueOnce({});

    found = findPackageManagerFromManifest('__not_important__', installed);
    expect(mockFindManifestInDirectory).toHaveBeenCalledWith('__not_important__');
    expect(found).toBeTruthy();
    expect(found.length).toEqual(0);
  });
});

// eslint-disable-next-line no-secrets/no-secrets
describe('findPackageManagerFromSignatureFiles', () => {
  beforeEach(() => {
    mockCheckPackageManagerFiles.mockReset();
  });
  it('should return installed pm with files in directory', () => {
    const installed: PackageManager[] = [
      { name: 'npm', version: '1.0.0', workspaces: false },
      { name: 'yarn', version: '2.1.1', workspaces: true },
      { name: 'pnpm', version: '5.1.1', workspaces: true }
    ];

    mockCheckPackageManagerFiles.mockImplementation((cwd: string, pm: string) => {
      return pm === 'npm' || pm === 'yarn';
    });

    const found = findPackageManagerFromSignatureFiles('__not_important__', installed);
    expect(mockCheckPackageManagerFiles).toHaveBeenCalledTimes(3);
    expect(found.length).toEqual(2);
    expect(found.find((value) => value.name === 'npm')).toBeTruthy();
    expect(found.find((value) => value.name === 'yarn')).toBeTruthy();
  });

  it('should not return a not installed pm', () => {
    const installed: PackageManager[] = [
      { name: 'npm', version: '1.0.0', workspaces: false },
      { name: 'yarn', version: '2.1.1', workspaces: true }
    ];

    mockCheckPackageManagerFiles.mockImplementation((cwd: string, pm: string) => {
      return pm === 'pnpm' || pm === 'yarn';
    });

    const found = findPackageManagerFromSignatureFiles('__not_important__', installed);
    expect(mockCheckPackageManagerFiles).toHaveBeenCalledTimes(3);
    expect(found.length).toEqual(1);
    expect(found.find((value) => value.name === 'yarn')).toBeTruthy();
  });

  it('should return an empty result if no pm was found', () => {
    const installed: PackageManager[] = [];

    mockCheckPackageManagerFiles.mockImplementation(() => {
      return false;
    });

    const found = findPackageManagerFromSignatureFiles('__not_important__', installed);
    expect(mockCheckPackageManagerFiles).toHaveBeenCalledTimes(3);
    expect(found.length).toEqual(0);
  });
});
