---
'@lerepo/web-app': patch
---

fix: use addListener instead of addEventListener on the MQL for dark mode as Safari does not support addEventListener.
