jest.mock('~/internals/has-pm');
import { has } from '~/internals/has-pm';
const mockedHas = <jest.MockedFunction<typeof has>>has;

import { detectInstalledPackageManagers } from '~/detect-installed';
import { PackageManager } from '~/package-manager';

describe('detectInstalledPackageManagers', () => {
  afterEach(() => {
    mockedHas.mockReset();
  });

  it('should check for all known package managers', async () => {
    const known = ['npm', 'pnpm', 'yarn'];
    const calledWith: string[] = [];
    mockedHas.mockImplementation(
      async (name: string): Promise<PackageManager | null> => {
        calledWith.push(name);
        return null;
      }
    );
    await detectInstalledPackageManagers();
    expect(mockedHas).toBeCalledTimes(3);
    known.map((pm) => {
      expect(calledWith.includes(pm)).toBeTruthy();
    });
  });

  it('should only return found package managers', async () => {
    mockedHas.mockImplementation(
      async (name: string): Promise<PackageManager | null> => {
        return name === 'yarn'
          ? {
              name: 'yarn',
              version: '2.1.1',
              workspaces: true
            }
          : null;
      }
    );
    const found = await detectInstalledPackageManagers();
    expect(mockedHas).toBeCalledTimes(3);
    expect(found.length).toEqual(1);
    expect(found[0]).toEqual({
      name: 'yarn',
      version: '2.1.1',
      workspaces: true
    });
  });

  it('should return empty array when no pm is installed', async () => {
    mockedHas.mockImplementation(
      async (): Promise<PackageManager | null> => {
        return null;
      }
    );
    const found = await detectInstalledPackageManagers();
    expect(mockedHas).toBeCalledTimes(3);
    expect(found.length).toEqual(0);
  });
});
