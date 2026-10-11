# Claudian Spinner Verbs

Shows your own `spinnerVerbs` from Claude Code's `~/.claude/settings.json` in the thinking indicator of [Claudian](https://github.com/YishenTu/claudian), so Claudian in Obsidian says the same things as Claude Code in your terminal.

The plugin does not modify Claudian. It watches for Claudian's thinking indicator and swaps the text when it appears.

## Requirements

- Obsidian desktop (the plugin reads a file from your home folder, so it does not run on mobile)
- [Claudian](https://github.com/YishenTu/claudian) installed and enabled
- A `spinnerVerbs` entry in `~/.claude/settings.json`

## Configuration

The plugin uses the same setting as Claude Code. Add `spinnerVerbs` to `~/.claude/settings.json`:

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Brewing", "Tinkering", "Noodling", "Scheming"]
  }
}
```

- `verbs`: the texts to show. `...` is added to the end of each one, matching Claudian's style.
- `mode`:
  - `"replace"` (default): only your verbs are shown.
  - `"append"`: your verbs are mixed in with Claudian's built-in texts.

There is nothing to configure inside Obsidian. Changes to `settings.json` are picked up automatically the next time the indicator appears, no reload needed.

If `spinnerVerbs` is missing, empty or the file can't be read, Claudian's own texts are left as they are.

## How it works

- A `MutationObserver` watches for `.claudian-thinking` elements.
- Only Claudian's built-in default texts (from Claudian v2.3.16) are replaced. Any other status Claudian shows is left alone.
- `settings.json` is only re-read when its modification time changes.

If a future Claudian version changes its default texts or markup, the plugin may stop swapping until it is updated. Issues and pull requests are welcome.

## Installation

### From the community plugin directory

Coming soon.

### Manually

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/andyjohansson/claudian-spinner-verbs/releases/latest).
2. Put them in `<your vault>/.obsidian/plugins/claudian-spinner-verbs/`.
3. Reload Obsidian and enable **Claudian Spinner Verbs** under Settings → Community plugins.

## License

[MIT](LICENSE)
