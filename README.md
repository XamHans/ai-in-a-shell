# AI in a Shell

A small developer pilot for Apple Silicon Macs. The public repository contains the installable Codex skill and the desktop app in [release v0.1.0-pilot.3](https://github.com/XamHans/ai-in-a-shell/releases/tag/v0.1.0-pilot.3).

## Install the skill

Requirements: Node.js 22.20 or newer and the Codex CLI, signed in with your own account.

Run:

```sh
npx --yes skills add XamHans/ai-in-a-shell -g -a codex -y
```

Start Codex in your project and invoke `$ai-in-a-shell`, for example: `$ai-in-a-shell Explain this project's entry point using code references.` If the desktop is unavailable or has another project open, open the matching project and check again, or continue in text.

## Open the desktop app

Download the [macOS Apple Silicon app](https://github.com/XamHans/ai-in-a-shell/releases/download/v0.1.0-pilot.3/ai-in-a-shell-0.1.0-pilot.3-macos-arm64.dmg), open the DMG, and drag **AI in a Shell Canvas** to **Applications**. Open your project in the app.

In an empty chat, click **Erste Frage vorbereiten** to fill the composer with a suggested question. Edit it as you like and submit it yourself. After reopening the app, find saved notes under **Sessions** and open the note you need.

The app is ad-hoc signed and not notarized. macOS may block its first opening; follow Apple's per-app [Open Anyway](https://support.apple.com/en-us/102445) steps, and proceed only if macOS identifies the app as intact.
