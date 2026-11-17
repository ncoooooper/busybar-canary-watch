# Canary Watch

Compare one service’s uptime and response latency before and after a release on your BUSY Bar.

Set Service health URL to a small health endpoint you operate. The app samples it at launch and every 30 seconds while open. Click for a manual probe. The wheel switches between availability and latency.

Collect pre-release samples, then press Start at deployment. The current window freezes as the baseline. The next twenty probes form a rolling comparison window. The rear panel shows both sample counts, availability change in percentage points, and latency change in milliseconds. Hold Start to replace the baseline with the current window for a later release.

Availability is the fraction of probes with a successful HTTP status. Mean response time uses successful probes only. If all probes fail, latency is unavailable. Measurements include transport from the device. Both windows survive app restarts. Changing to a different URL starts a new comparison. Use a small unauthenticated endpoint without credentials in its URL.

For example, while Quiet Queue is running locally, allow local port 8766 in the emulator and set the endpoint to `http://127.0.0.1:8766/queue`. The same procedure works with your own reachable HTTP(S) health URL.

## Run locally

From this folder, run `~/.busy-emulator/bin/busy-emulator dev --once` with BUSY Bar Emulator open. Back exits.

![BUSY Bar front display](screenshots/front-1.png)
