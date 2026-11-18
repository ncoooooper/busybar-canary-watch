# Canary Watch

Compare one service’s uptime and response latency before and after a release on your BUSY Bar.

Mark a rollout at the moment it happens. The display keeps the pre-release readings alongside the next samples, so you can tell whether a visible change began after the deployment.

## Set the baseline at deployment

1. Set the app’s health URL to a small endpoint you operate and open the app. Check the rear screen for the sample count. The display takes a reading every 30 seconds while open.
2. After collecting pre-release samples, press **Start** at rollout. Those readings become the baseline. The next probes belong to the post-release window.
3. Click to take an extra reading. The clip shows post-release uptime moving from 50% to 67% as another successful reading arrives.

![Post-release availability changes from 50 percent to 67 percent.](media/guide/watch-post-release-uptime.gif)

## Check whether successful requests slowed down

1. Turn the wheel to **POST LATENCY**. This is the average duration of successful probes in the current window. Read the new average in milliseconds.
2. On the rear display, compare the current value and sample count with **Base**, then read **Diff**. Availability changes use percentage points and latency changes use milliseconds.
3. Hold **Start** at the next deployment if you want the current window to become the new baseline.

![The wheel switches the post-release front display from 67 percent uptime to the latency reading.](media/guide/inspect-post-latency.gif)

## Compare like with like

Keep the same URL for both windows. For a service with 20 current samples and two failed requests, uptime is 90%. A 100% baseline would give a change of −10 percentage points. Failed requests are counted in uptime but excluded from mean latency. If none succeed, the latency display reads `--`. The time includes the connection from the bar.

The current window holds up to 20 probes. Both windows survive closing the app. Changing the URL starts a new comparison.

## Setup

Use a reachable HTTP(S) endpoint that needs no credentials. For example, if the Quiet Queue companion is already running locally, allow port 8766 in the emulator and use `http://127.0.0.1:8766/queue`.

## Run in the emulator

Open BUSY Bar Emulator. From this repository, run:

```sh
~/.busy-emulator/bin/busy-emulator dev --once
```

Press **Back** to exit.

The GIFs are excerpts from the emulator recording. Each front-display pixel is shown at 9× its original width and height. The end frames pause for reading.

[Full recording](media/controls.mp4) · [Rear display](screenshots/back-1.png) · [Firmware test](EMULATOR-QA.md) · [MIT license](LICENSE)
