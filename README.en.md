# StarDream CTX (sd_ctx)

[简体中文](README.md) | [English](README.en.md)

A Manifest V3 browser extension. The toolbar popup is in [`popup/`](popup/); [`background.js`](background.js) is the service worker and [`content.js`](content.js) is the content script.

## Permissions
The [manifest](manifest.json) requests tabs, scripting, cookies, storage and access to all URLs. Review the source and these permissions before enabling the extension in a browser profile.
