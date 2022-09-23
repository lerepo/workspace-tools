jest.mock('~/internals/find-pm');
jest.mock('~/detect-installed');

import {
  findPackageManagerFromManifest,
  findPackageManagerFromSignatureFiles
} from '~/internals/find-pm';
const mockFindPackageManagerFromManifest = <
  jest.MockedFunction<typeof findPackageManagerFromManifest>
>findPackageManagerFromManifest;
const mockFindPackageManagerFromSignatureFiles = <
  jest.MockedFunction<typeof findPackageManagerFromSignatureFiles>
>findPackageManagerFromSignatureFiles;

import { detectInstalledPackageManagers } from '~/detect-installed';
const mockDetectInstalledPackageManagers = <
  jest.MockedFunction<typeof detectInstalledPackageManagers>
>detectInstalledPackageManagers;

import { detectPackageManagers } from '~/detect';

describe('detectPackageManagers', () => {
  afterEach(() => {
    mockFindPackageManagerFromManifest.mockReset();
    mockFindPackageManagerFromSignatureFiles.mockReset();
    mockDetectInstalledPackageManagers.mockResolvedValue([
      {
        name: 'yarn',
        version: '2.1.1',
        workspaces: true
      },
      {
        name: 'pnpm',
        version: '6.5.1',
        workspaces: true
      }
    ]);
  });

  it('should detect package manager from manifest', async () => {
    mockFindPackageManagerFromManifest.mockReturnValue([
      {
        name: 'yarn',
        version: '2.1.1',
        workspaces: true
      }
    ]);
    const found = await detectPackageManagers();
    expect(mockFindPackageManagerFromManifest).toHaveBeenCalled();
    expect(found).toBeDefined();
    expect(found).toEqual({
      name: 'yarn',
      version: '2.1.1',
      workspaces: true
    });
  });

  it('should detect package manager from signature files', async () => {
    mockFindPackageManagerFromManifest.mockReturnValue([]);
    mockFindPackageManagerFromSignatureFiles.mockReturnValue([
      {
        name: 'yarn',
        version: '2.1.1',
        workspaces: true
      }
    ]);
    const found = await detectPackageManagers();
    expect(mockFindPackageManagerFromManifest).toHaveBeenCalled();
    expect(found).toBeDefined();
    expect(found).toEqual({
      name: 'yarn',
      version: '2.1.1',
      workspaces: true
    });
  });

  it('should detect package manager from parent directory', async () => {
    mockFindPackageManagerFromManifest.mockReturnValueOnce([]).mockReturnValueOnce([
      {
        name: 'yarn',
        version: '2.1.1',
        workspaces: true
      }
    ]);
    const found = await detectPackageManagers({ cwd: '/project/workspace' });
    expect(mockFindPackageManagerFromManifest).toHaveBeenCalled();
    expect(found).toBeDefined();
    expect(found).toEqual({
      name: 'yarn',
      version: '2.1.1',
      workspaces: true
    });
  });

  it('should stop detection if it reaches the root with no pm detected', async () => {
    mockFindPackageManagerFromManifest.mockReturnValue([]);
    const found = await detectPackageManagers({ cwd: '/root/project/packages/workspace' });
    expect(mockFindPackageManagerFromManifest).toHaveBeenCalled();
    expect(found).toBeNull();
  });
});
