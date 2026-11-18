# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Two HTTP 200 probes to the live Quiet Queue service established a 100% baseline at 30 ms. Stopping the server produced a failed probe. Restarting it produced HTTP 200. The display then showed 50% availability against 100%, with latency averaged over successful probes. Relaunch restored two baseline and two post-release samples. Changing to a different endpoint cleared the old baseline and registered its HTTP 404 as down.

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.

Firmware motion pass: ok, start, up. 17 distinct frames in the controls recording. App io.ncoooooper.canarywatch exited: finished; heap peak 83.4 of 128 KiB.

## Display capture

Firmware 1.3.1 rendered both README examples. The display run replayed sample inputs in a separate emulator project. The source test above describes how those readings were obtained. Each square in a guide GIF is one front LED in a 16 × 16 cell. The production archive was built from the source in this repository.

## New mode

Two interactions were captured on firmware 1.3.1. Recorded source response. Back exited the app cleanly. See [recording details](media/source-mode-check.json).

## Screen transition capture

Firmware 1.3.1 rendered the display sequences in the README. The guide uses a 14 × 14 lit area inside each 16 × 16 cell. Input sequences, frame counts and the release archive checksum are in [the capture record](media/screen-transitions.json).
