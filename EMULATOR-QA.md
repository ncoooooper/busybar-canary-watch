# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Two HTTP 200 probes to the live Quiet Queue service established a 100% baseline at 30 ms. Stopping the server produced a failed probe. Restarting it produced HTTP 200. The display then showed 50% availability against 100%, with latency averaged over successful probes. Relaunch restored two baseline and two post-release samples. Changing to a different endpoint cleared the old baseline and registered its HTTP 404 as down.

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.
