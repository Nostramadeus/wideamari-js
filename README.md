# wideamari-js

Extra JavaScript for the cytu.be channel **wideamari**.

| File | What it is |
|---|---|
| `wideamari-extra.js` | The "/" emote dropdown + sound emotes. cytu.be loads it from Channel settings → **External Javascript**: `https://nostramadeus.github.io/wideamari-js/wideamari-extra.js` |
| `channel-js.js` | What goes in Channel settings → Edit → **JavaScript** (the rest of the channel code, under cytu.be's 20,000-character limit). |
| `sounds/` | Sound files the sound emotes play. |
| `backup/live-channel-js-2026-11-06.js` | The full channel JavaScript as it was live on 2026-11-06, before this split. Paste it back into Edit → JavaScript (and clear External Javascript) to undo. |

## Adding a sound

1. Put the mp3 in `sounds/`.
2. Add one line to the `SOUNDS` list at the top of the sound emotes part of `wideamari-extra.js`:
   - a sound on an existing emote: `{ emote: '/laugh', url: 'https://nostramadeus.github.io/wideamari-js/sounds/laugh.mp3' },`
   - a sound-only name that borrows an emote's picture: `{ name: '/laughsound', look: '/laugh', url: '...' },`

The old readable dropdown source was at https://ghostbin.lain.la/paste/85roa (kept here as a backup link; the current source is this repo).
