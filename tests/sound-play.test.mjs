// Play rules of the sound emotes, run on the real block from wideamari-extra.js in jsdom.
// Run: node tests/sound-play.test.mjs   (jsdom borrowed from another local project; no npm install here)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { JSDOM } = createRequire(import.meta.url)('F:/Projects/4chanxt-you-scanner/wt-hasj/node_modules/jsdom');

const full = fs.readFileSync(new URL('../wideamari-extra.js', import.meta.url), 'utf8');
const s = full.indexOf('/*! sound emotes start */');
const e = full.indexOf('/*! sound emotes end */');
const BLOCK = full.slice(s, e + '/*! sound emotes end */'.length)
    .replace(/^(\s*)\{ name: '\/doroclapsound', look: '\/doroclap', url: '[^']*' \}/m, "$1{ name: '/doroclapsound', look: '/doroclap', url: 'A.mp3' }")
    .replace("// { emote: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },", "{ emote: '/doroclap', url: 'B.mp3' },");
if (!BLOCK.includes("'A.mp3'") || !BLOCK.includes("'B.mp3'")) throw new Error('could not build the test block');

let pass = 0, fail = 0;
const check = (name, ok, detail) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : ' :: ' + JSON.stringify(detail))); };

function page(storage) {
    const dom = new JSDOM('<!DOCTYPE html><body><div id="leftcontrols"></div><div id="messagebuffer"></div><input id="chatline"></body>',
        { runScripts: 'outside-only', url: 'https://cytu.be/r/wideamari', pretendToBeVisual: true });
    const w = dom.window;
    const plays = [];
    const live = [];
    w.Audio = class {
        constructor(src) { this.src = src || ''; this.volume = 1; this.l = {}; }
        cloneNode() { return new w.Audio(this.src); }
        addEventListener(t, f) { (this.l[t] = this.l[t] || []).push(f); }
        play() { plays.push({ src: this.src, at: Date.now() }); live.push(this); return Promise.resolve(); }
        pause() { (this.l.pause || []).forEach(f => f()); }
        end() { (this.l.ended || []).forEach(f => f()); }
    };
    if (storage) w.localStorage.setItem('wideamari-sound', storage);
    const handlers = [];
    w.socket = { on(ev, f) { if (ev === 'chatMsg') handlers.push(f); }, off() {} };
    const doro = { name: '/doroclap', image: 'https://wideamari.pages.dev/doroclap.gif' };
    w.CHANNEL = { emotes: [doro], emoteMap: { '/doroclap': doro } };
    w.USEROPTS = {}; w.IGNORED = [];
    w.eval('function execEmotes(m){return m}');
    w.eval(BLOCK);
    let t = Date.now() + 1000;
    const send = (msg, user = 'a') => { t += 1; handlers.forEach(f => f({ username: user, time: t, meta: {}, msg })); };
    const img = (name, cls = 'channel-emote wideamari-sound-emote') => `<img class="${cls}" title="${name}" src="x.gif">`;
    return { w, plays, live, send, img };
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// 1. four in one message = four plays, 0.25 s apart
{
    const p = page();
    p.send([1, 2, 3, 4].map(() => p.img('/doroclapsound')).join(' '));
    check('4 in one message: first plays at once', p.plays.length === 1, p.plays);
    await wait(900);
    check('4 in one message: 4 plays total', p.plays.length === 4 && p.plays.every(x => x.src === 'A.mp3'), p.plays);
    const gaps = p.plays.slice(1).map((x, i) => x.at - p.plays[i].at);
    check('repeats are about 0.25 s apart', gaps.every(g => g >= 200 && g <= 400), gaps);
}
// 2. back-to-back messages, same user and different users, all play (no cooldown)
{
    const p = page();
    p.send(p.img('/doroclapsound'), 'a');
    p.send(p.img('/doroclapsound'), 'a');
    p.send(p.img('/doroclapsound'), 'b');
    check('3 messages right after each other (2 users) = 3 plays', p.plays.length === 3, p.plays);
}
// 3. plain words still work, and the attached-emote kind
{
    const p = page();
    p.send('/doroclapsound hi /doroclapsound');
    p.send('lol ' + p.img('/doroclap', 'channel-emote'));
    await wait(400);
    // order differs on purpose: the 2nd message starts at once, the 1st message's repeat 0.25 s later
    check('plain words: 2 plays; attached emote: 1 play', p.plays.map(x => x.src).sort().join() === 'A.mp3,A.mp3,B.mp3', p.plays);
}
// 4. caps: 6 per message, 6 at the same time
{
    const p = page();
    p.send(Array(10).fill('/doroclapsound').join(' '));
    await wait(1600);
    check('10 in one message plays only 6', p.plays.length === 6, p.plays.length);
    const first = p.live[0];
    p.send('/doroclapsound');
    check('a 7th while 6 play: it plays and the oldest stops', p.plays.length === 7 && p.live.length === 7, p.plays.length);
    first.volume = -1; // the stopped one must not be touched by later volume updates
    p.send('/doroclapsound');
    check('stopped sounds are no longer volume-updated', first.volume === -1, first.volume);
}
// 5. crowd volume: 1 sound = 40 %, each extra +10 %, 6 at once = 60 % (150 % of 40); back down as they end
{
    const p = page();
    p.send('/doroclapsound');
    const v1 = p.live[0].volume;
    p.send('/doroclapsound'); p.send('/doroclapsound'); p.send('/doroclapsound'); p.send('/doroclapsound'); p.send('/doroclapsound');
    const v6 = p.live.map(a => a.volume);
    p.live.slice(1).forEach(a => a.end());
    const back = p.live[0].volume;
    const near = (a, b) => Math.abs(a - b) < 1e-9;
    check('1 sound plays at the viewer volume (40 %)', near(v1, 0.4), v1);
    check('6 at once: all of them at 60 %', v6.every(v => near(v, 0.6)), v6);
    check('when the others end, the last one drops back to 40 %', near(back, 0.4), back);
    const q = page(JSON.stringify({ on: true, volume: 90 }));
    for (let i = 0; i < 6; i++) q.send('/doroclapsound');
    check('loud viewer (90 %): capped at 100 %, never above', q.live.every(a => a.volume <= 1 && near(a.volume, 1)), q.live.map(a => a.volume));
}
// 6. muted viewer hears nothing; join history never plays
{
    const p = page(JSON.stringify({ on: false, volume: 40 }));
    p.send('/doroclapsound');
    check('muted: nothing plays', p.plays.length === 0, p.plays);
    check('history check exists (older than load is skipped)', BLOCK.includes('if (time < loadedAt) return false;'), null);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
