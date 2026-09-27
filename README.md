# IAQ Dashboard — deploy

1. In the GitHub repo, DELETE: worker.js, layout-overrides.css, redesign-direct.css, sensor-evidence-view.css, sensor-evidence-view.js, sensor-evidence-loader.js, visualization-layout.js
2. Replace index.html and wrangler.jsonc with the files in this folder. Add .assetsignore.
3. Add `floorplan.png` and `floorplan-3d.webp` (included here) to the repo root.
4. Commit to main. Cloudflare redeploys automatically.
5. Hard-refresh the site (Ctrl/Cmd+Shift+R).

Saved uploads (browser localStorage key `iaq-saved-data`) carry over from the old dashboard.

## Owner PIN
Uploads are hidden until the owner enters a PIN (click the ••• button in the footer). PIN is set (ask the owner).
To change it: in index.html source (IAQ Dashboard v2.dc.html), replace OWNER_PIN_HASH with the SHA-256 of "iaq:" + your PIN.
Note: this hides the upload panel from visitors; it is not server-side security. Uploads only save to the owner's own browser.
