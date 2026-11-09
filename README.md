# AI in a Shell — developer pilot

This is a small developer pilot for Apple Silicon Macs. The [public repository](https://github.com/XamHans/ai-in-a-shell) contains the installable skill and the [desktop pilot release](https://github.com/XamHans/ai-in-a-shell/releases/tag/v0.1.0-pilot.1).

The skill package is updated separately from the desktop app. The current skill release is `v0.1.0-pilot.2`; the desktop download remains `v0.1.0-pilot.1`.

## Requirements

- Node.js 22.20 or newer
- Codex CLI installed and signed in with your own account
- macOS on Apple Silicon for the desktop app

## Install the skill

Run this in a terminal:

```sh
npx --yes skills add XamHans/ai-in-a-shell -g -a codex -y
```

Open a project in Codex and invoke the skill with a concrete question, for example:

```text
$ai-in-a-shell Please help me trace how this project handles user sign-in.
```

For desktop work, open the same project folder in the Desktop. If the skill reports that the Desktop is unavailable or has another project open, retry after opening that folder or continue in text.

## Download the desktop pilot

[Download the AI in a Shell macOS Apple Silicon pilot](https://github.com/XamHans/ai-in-a-shell/releases/download/v0.1.0-pilot.1/ai-in-a-shell-0.1.0-pilot.1-macos-arm64.dmg).

Open the downloaded DMG and drag **AI in a Shell Canvas** to **Applications**. Open your project in the app and ask a concrete first question. The app is an ad-hoc signed pilot and is not notarized. macOS may block the first opening; if so, use Apple's per-app **Open Anyway** steps in [Safely open apps on your Mac](https://support.apple.com/en-us/102445). Only proceed when macOS identifies the app as intact.

The Codex skill and desktop app are separate entry points in this pilot. Installing the skill does not pair an external Codex chat with the desktop app or transfer its transcript.
