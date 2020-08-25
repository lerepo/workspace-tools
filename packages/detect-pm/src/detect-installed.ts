import { has } from '~/internals/has-pm';
import { PackageManager, PackageManagerName } from '~/package-manager';

export const detectInstalledPackageManagers = async (): Promise<PackageManager[]> => {
  return Promise.all((<PackageManagerName[]>['yarn', 'npm', 'pnpm']).map((pm) => has(pm))).then(
    (res) => {
      const found: PackageManager[] = [];
      res.map((item) => {
        if (item && item.version) {
          found.push(item);
        }
      });
      return found;
    }
  );
};
