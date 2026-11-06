# Sound check (wideamari tab)

1. On the cytu.be wideamari tab, press **F12** and click the **Console** tab.
2. If Chrome shows a warning about pasting, type `allow pasting` and press Enter first.
3. Paste this and press Enter:

```text
new Audio('https://nostramadeus.github.io/wideamari-js/sounds/doroclap-3s.mp3').play()
```

4. Then paste this and press Enter:

```text
[localStorage.getItem('wideamari-sound'), !!window.__wideamariSound, typeof window.socket]
```

Tell Claude: did you hear a clap after step 3, what did step 4 print, and is there any red text in the Console?

## Round 2 (the clap played, so the file and browser are fine)

5. In the same Console, paste this and press Enter:

```text
socket.on('chatMsg', d => console.log('[probe]', JSON.stringify(d.msg), d.time, Date.now(), d.username))
```

6. Type `/doroclapsound` in the chat and send it.
7. Screenshot the `[probe]` line that appears in the Console.

