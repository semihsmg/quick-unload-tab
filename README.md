# Quick Unload Tab

A Firefox add-on that unloads the current tab with a keyboard shortcut and switches back to the tab you used last.

## Usage

Press **Cmd+Shift+U** (macOS) or **Ctrl+Shift+U** (Windows/Linux).

Unloaded tabs stay in the tab bar and reload when you click them. This matches Firefox's built-in "Unload Tab" context menu item.

The add-on switches to the most recently used tab that's still loaded, so an unloaded tab never gets woken up. If every other tab is already unloaded, it opens a new tab.

To change the shortcut, go to `about:addons` → gear icon → **Manage Extension Shortcuts**.

## Development

Load it temporarily through `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → select `manifest.json`.

```sh
npx web-ext lint
npx web-ext sign   # submits to AMO as a listed add-on; needs WEB_EXT_API_KEY / WEB_EXT_API_SECRET
```

## License

[GPL-3.0](LICENSE)
