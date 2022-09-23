# Detect which package manager is being used

This is a library and a cli to automatically detect which package manager is
being used in the current project. The project can be a single workspace or a
multi-workspace project.

Detected package managers are:

- npm
- yarn (v1)
- yarn berry (v2)
- pnpm

## Usage

```javascript
import { detectPackageManagers, PackageManager } from '@lerepo/detect-package-manager';

const found: PackageManager = await detectPackageManagers({
  preference: ['pnpm', 'yarn']
});
if (found) console.log(`${found.name} ${found.version}`);
```

```javascript
import { detectInstalledPackageManagers } from '@lerepo/detect-package-manager';

const found: PackageManager[] = await detectInstalledPackageManagers({
  preference: ['pnpm', 'yarn']
});
console.log(found);
```
