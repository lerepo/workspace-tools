import childProcess from 'child_process';

import semver from 'semver';
jest.mock('semver');
const mockedSemverClean = <jest.MockedFunction<typeof semver.clean>>(
  semver.clean
);

import { InstalledPackageManagerLocator, has } from '~/internals/has-pm';

describe('PackageManagerLocator', () => {
  let execfs;

  beforeEach(() => {
    execfs = jest.spyOn(childProcess, 'execSync');
  });

  afterEach(() => {
    execfs.mockRestore();
  });

  it('should throw if version is accessed before detect', () => {
    const pm = new InstalledPackageManagerLocator('npm');
    expect(() => pm.version).toThrow(/call detect()/);
  });
  it('should detect package manager', async () => {
    const pm = new InstalledPackageManagerLocator('npm');
    execfs.mockReturnValue('1.2.3');
    mockedSemverClean.mockReturnValue('1.2.3');
    await pm.detect();
    expect(execfs).toHaveBeenCalledTimes(1);
    expect(pm.name).toEqual('npm');
    expect(pm.version).toEqual('1.2.3');
    expect(pm.error).toBeNull();
  });

  it('should have an error when pm is not installed', async () => {
    const pm = new InstalledPackageManagerLocator('npm');
    execfs.mockImplementationOnce(() => {
      throw new Error('not found');
    });
    await pm.detect();
    expect(execfs).toHaveBeenCalledTimes(1);
    expect(pm.error).toMatch(/not found/);
    expect(() => pm.version).toThrow(/not installed/);
  });

  it('should have an error when pm does not return semantic version number', async () => {
    const pm = new InstalledPackageManagerLocator('npm');
    execfs.mockReturnValue('testing version');
    mockedSemverClean.mockReturnValue(null);
    await pm.detect();
    expect(execfs).toHaveBeenCalledTimes(1);
    expect(pm.error).toMatch(/not a valid semantic version/);
    expect(() => pm.version).toThrow(/not installed/);
  });
});

describe('has', () => {
  let mockDetect;
  let mockError;
  beforeAll(() => {
    mockDetect = jest.spyOn(InstalledPackageManagerLocator.prototype, 'detect');
    mockError = jest.spyOn(
      InstalledPackageManagerLocator.prototype,
      'error',
      'get'
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should call detect()', () => {
    has('npm');
    expect(mockDetect).toHaveBeenCalled();
  });

  it('should return null if detection fails', async () => {
    mockError.mockReturnValue('failed');
    const pm = await has('npm');
    expect(mockDetect).toHaveBeenCalled();
    expect(mockError).toHaveBeenCalled();
    expect(pm).toBeNull();
  });

  it('should return valid pm if detection succeeds', async () => {
    mockError.mockReturnValue(null);
    const pm = await has('npm');
    expect(mockDetect).toHaveBeenCalled();
    expect(mockError).toHaveBeenCalled();
    expect(pm).not.toBeNull();
  });
});
