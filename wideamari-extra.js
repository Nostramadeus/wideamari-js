/*! wideamari channel JavaScript: the WHOLE channel script lives in this one file.
 * cytu.be loads it from Channel settings → General settings → External Javascript:
 *   https://nostramadeus.github.io/wideamari-js/wideamari-extra.js
 * The Edit → JavaScript box only holds a short pointer comment (cytu.be cuts that box at 20,000 characters).
 * Updating this JS? Feel free to replace that External Javascript link with a link to your own copy.
 * Readable source + history: https://github.com/Nostramadeus/wideamari-js
 * Undo: paste backup/live-channel-js-2026-11-06.js into Edit → JavaScript and clear External Javascript. */
/*! widening MOTD button start */
(function(){ 'use strict'; function init(){ const b=document.querySelector('#motd .wide-motd-button'); const d=b&&b.closest('details.wide-motd-details'); if(!b||!d||b.dataset.ready)return !!b; b.dataset.ready=1; b.dataset.w= b.getBoundingClientRect().width||132; function state(){ const a=d.open?'Close':'Open'; b.setAttribute('aria-expanded',d.open); b.setAttribute('aria-label',a+' schedule'); b.title=a+' schedule — every click makes me 10% wider'; } b.onclick=function(e){ e.preventDefault();e.stopPropagation(); let w=+b.dataset.w||132,n=w*1.1; b.dataset.w=n; b.style.width=n+'px'; b.classList.remove('hop'); void b.offsetWidth; if(!matchMedia('(prefers-reduced-motion:reduce)').matches)b.classList.add('hop'); d.open=!d.open; state(); }; b.onanimationend=function(){ b.classList.remove('hop'); }; d.ontoggle=state; state(); return true; } if(!init()){ const o=new MutationObserver(()=>{if(init())o.disconnect()}); o.observe(document.documentElement,{childList:true,subtree:true}); setTimeout(()=>o.disconnect(),10000); } })();
/*! widening MOTD button end */

/*! nyanpass start */
(function() {
    const api = 'https://lqjbyvqiialqkraemibh.supabase.co/rest/v1/rpc';
    const key = 'sb_publishable_wKKC3NpoUHfLsXhzdOBi1A_l0yG5ba7';
    const audio = new Audio('https://wideamari.pages.dev/nyanpass.mp3');
    audio.volume = 0.5;

    function setupNyan(poll) {
        const title = poll.querySelector('h3');
        
        if (!title || !title.textContent.includes('nyanpass') || poll.dataset.nyan) return;
        poll.dataset.nyan = '1';
        const link = title.querySelector('a');
        if (link) link.href = 'https://nyanpass.nohmdd.workers.dev';

        poll.classList.add('nyanpass-poll');

        const img = document.createElement('img');
        img.src = 'https://wideamari.pages.dev/nyanpassvote.png';
        img.className = 'nyanpass-img';
        poll.appendChild(img);

        let count = 0;
        const headers = {
			apikey: key,
			'Content-Type': 'application/json'
		};

        const updateUI = () => {
            if (!count) return;
            let span = title.querySelector('.nyan-global-count');
            if (!span) {
                span = document.createElement('span');
                span.className = 'nyan-global-count';
                title.appendChild(span);
            }
            span.textContent = ` ${count.toLocaleString()}!`;
        };

        const fetchCount = async () => {
            try {
                const data = await (await fetch(`${api}/get_nyan`, { headers })).json();
                if (data > count) {
                    count = Number(data);
                    updateUI();
                }
            } catch (err) { console.error('Nyan fetch err:', err); }
        };

        fetchCount();
        const timer = setInterval(() => {
            if (!document.body.contains(poll) || !poll.classList.contains('active')) {
                clearInterval(timer);
            } else fetchCount();
        }, 5000);

        const btn = poll.querySelector('.option button');
        if (btn) {
            btn.addEventListener('click', () => {
                img.classList.remove('animate-click');
                void img.offsetWidth;
                img.classList.add('animate-click');

                audio.currentTime = 0;
                audio.play().catch(console.error);

                if (count) {
                    count++;
                    updateUI();
                }

                fetch(`${api}/add_nyan`, {
                    method: 'POST',
                    headers,
                    body: '{}'
                }).catch(console.error);
            });

            img.addEventListener('click', () => btn.click());
        }
    }

    const obs = new MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType === 1) { 
                    if (n.matches('.well.active')) setupNyan(n);
                    else {
                        const w = n.querySelector('.well.active');
                        if (w) setupNyan(w);
                    }
                }
            }
        }
    });

    (function init() {
        const wrap = document.getElementById('pollwrap');
        if (wrap) {
            obs.observe(wrap, { childList: true, subtree: true });
            const active = wrap.querySelector('.well.active');
            if (active) setupNyan(active);
        } else setTimeout(init, 1000);
    })();
})();
/*! nyanpass end */


    // yunose mirror
    $.get('https://factory.global.ssl.fastly.net/stuff/mirror_userscript2.js')

    // Clock above chat
    let clockInterval = 0;
    const chatClock = document.createElement('p');
    chatClock.id = 'chatClock';
    chatClock.style.flexGrow = '2';
    chatClock.style.fontFamily = 'system-ui';
    document.getElementById("usercount").insertAdjacentElement('afterend', chatClock);

    const setChatClock = () => {
        const clockDate = new Date();
        const localTime = clockDate.toLocaleTimeString("JPN");
        const UTCTime = clockDate.toLocaleTimeString("JPN", {timeZone: 'UTC'});

        chatClock.innerText = `Local ${localTime} | UTC ${UTCTime}`;
    }
	
    setChatClock();
    clockInterval = setInterval(setChatClock, 1000);

    // Favicon
    const favicon=document.createElement('link');
    favicon.id='favicon';
    favicon.rel='shortcut icon';
    favicon.type='image/png';
    favicon.sizes='64x64';
    favicon.href='https://wideamari.pages.dev/_favicon.png';
    document.head.appendChild(favicon);

    // Keybinds
    var keyHeld = false; //control keypress rapidfire
    $(window).bind('keyup', function(){ keyHeld=false; });

    $(window).bind('keydown', function(event) {
        var inputBox = document.getElementById("chatline");
        var inputVal = inputBox.value;

        if (event.ctrlKey && !event.shiftKey){
            switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a': //Select input box
                // Check if we already have some form of text input focused
                const INPUT_TAGS = ["INPUT", "TEXTAREA"];
                if (INPUT_TAGS.includes(document.activeElement.tagName)) return;

                event.preventDefault();
                if(!keyHeld){
                    keyHeld=true;
                    inputBox.focus();
                    inputBox.setSelectionRange(0,inputVal.length);
                }

                break;
            case 's': //spoiler
                if (!keyHeld) {
                    keyHeld=true;
                    event.preventDefault();
                    var selSt = inputBox.selectionStart;
                    var selEnd = inputBox.selectionEnd;

                    if (inputBox === document.activeElement) {
                        if(inputBox.selectionStart == inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selSt +4,selSt +4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0,selSt) +"[sp]"+ inputVal.substring(selSt,selEnd) +"[/sp]"+inputVal.substring(selEnd,inputVal.length);
                            inputBox.setSelectionRange(selEnd+9,selEnd+9);
                        }
                    }
                }
                
                break;
            }
        }
    });

(function() {
    // Store the original functions
    var originalNewPoll = Callbacks.newPoll;
    var originalUpdatePoll = Callbacks.updatePoll;

    // Override newPoll to add 862 to vote counts
    Callbacks.newPoll = function(data) {
        // Create a modified data object with adjusted counts
        var modifiedData = JSON.parse(JSON.stringify(data));
        modifiedData.counts = modifiedData.counts.map(count => count + 862);

        // Call the original function with modified data
        originalNewPoll.call(this, modifiedData);
    };

    // Override updatePoll to add 862 to vote counts
    Callbacks.updatePoll = function(data) {
        // Create a modified data object with adjusted counts
        var modifiedData = JSON.parse(JSON.stringify(data));
        modifiedData.counts = modifiedData.counts.map(count => count + 862);

        // Call the original function with modified data
        originalUpdatePoll.call(this, modifiedData);
    };
})();

//Yunose's playlist add-on
// ==UserScript==
// @name cytube times
// @author nuui and others
// @match *://cytu.be/*
// @grant GM_addStyle
// ==/UserScript==

// https://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey/46285637#46285637
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

addGlobalStyle(`
.btn-mirror { float: right; margin-left: 5px; }
.qe_startTime { float: right; margin-right: 3px; }
`);

// need to do this so that the userscript will actually run in the page's context, thanks chromium for being a piece of shit
// modifying the extension manifest after install to add "world":"MAIN" doesn't even help, you have to do this
inject = () => {

    recalculate_start_times = (current_time) => {
        let active;
        let seconds = 0;
        let starts;
      	function jssuckssohard(num) {
          return (num + "").padStart(2, "0");
        }
      	function fmtreldate(secs) {
          let date = new Date((new Date()).getTime()+1000*secs);
          // no strftime()? not even printf()?
          return jssuckssohard(date.getHours()) + ":" + jssuckssohard(date.getMinutes());
        }
        for (const video of playlist.children) {
          	const time = video.getElementsByClassName('qe_time')[0]
            if (!time) {
                console.log("cytube.user.js: video with no time");
                console.log(video);
                continue;
            }
          	let startTime = video.getElementsByClassName('qe_startTime')
            if (startTime.length) startTime = startTime[0]
            else {
                startTime = document.createElement("span");
                startTime.classList.add("qe_startTime");
                time.parentElement.insertBefore(startTime,time.nextSibling);
            }

          	let sub = video.getAttribute("title").split(": ", 2)
            let user = ''
            if (sub && sub.length == 2) user = sub[1]
            if (!video.classList.contains("queue_entry")) {
              console.log("???");
              continue;
            }
            if (video.classList.contains("queue_active") && !active) active = video;
            let timestext = "";
            if (active) {
                const times = time.textContent.split(':');
                if (times.length == 3) seconds += 3600*parseInt(times.shift());
                if (times.length == 2) seconds += 60*parseInt(times.shift());
                let duration = parseInt(times.shift());
                seconds += duration;
                if (video == active) {
                seconds -= current_time;
                if (!starts) starts = fmtreldate(-current_time);
                }
                let ends = fmtreldate(seconds);
                seconds += 5; //cytube sync time
                timestext = `(${starts}-${ends})`
                starts = fmtreldate(seconds);
            }
            startTime.textContent = `${user} | ${timestext} | `;
        }
    }

    document.querySelector("#userlist").style = "height: 600px;";
    document.querySelector("#messagebuffer").style = "height: 600px;";

    vidRemoved = false;

    playlist = document.getElementById("queue");
    const socket_watch = new MutationObserver(mutations => {
        socket.on("mediaUpdate", (data) => { if (PLAYER && PLAYER.getTime && !vidRemoved) PLAYER.getTime(recalculate_start_times); else recalculate_start_times(data.currentTime); })
        socket.on("changeMedia", () => { recalculate_start_times(0); })
        socket_watch.disconnect();
    })
    socket_watch.observe(playlist, {childList: true, attributes: false, characterData: false, subtree: false});

	console.log("cytube.user.js injected");
}

// thanks google for wasting the time of everyone once again to protect nobody
//window.trustedTypes.createPolicy('default', {createHTML: (string) => string, createScript: (string) => string })
const s = document.createElement('script'); s.textContent = '(' + inject + ')()'
document.head.append(s)

/*! "/" emote dropdown start (type /h in chat; readable source kept by the channel owner) */
// Less intrusive variant: Tab is left to CyTube's own completion, Enter
// inserts an emote that was picked with the arrow keys and otherwise only
// closes the list (it never sends while the list is open), and the list only
// opens while typing (not while browsing chat history). The list opens for
// words starting with the channel's most common emote prefix (e.g. "/" or
// ":"). When Tab has at least two emotes to choose from, the list shows them
// with the one Tab put in the chat line highlighted.
// Sound emotes (the "sound emotes" block further down the channel JS) are
// listed too, with a speaker mark: sound-only names get their own row, emotes
// with a sound attached get the mark on their normal row. They are read from
// window.__wideamariSound and never added to CHANNEL.emotes, because the emote
// editor and Export read CHANNEL.emotes and could save them to the server.
;(function () {
    'use strict';
    var MAX = 30;
    var chatline = document.getElementById('chatline');
    if (!chatline || document.getElementById('emote-ac')) return;

    var style = document.createElement('style');
    style.textContent = [
        '#emote-ac{position:fixed;width:24em;z-index:10000;max-height:274px;overflow-x:hidden;overflow-y:auto;',
        'overscroll-behavior:contain;box-sizing:border-box;color:#eee;border:1px solid #000;border-radius:4px;',
        'background:#1b1b1f;box-shadow:0 6px 16px rgba(0,0,0,.55);font-size:14px;}',
        '#emote-ac[hidden]{display:none;}',
        '.emote-ac-row{width:100%;height:34px;display:flex;align-items:center;gap:8px;margin:0;padding:3px 8px;',
        'color:inherit;border:0;background:transparent;font:inherit;font-weight:700;text-align:left;cursor:pointer;}',
        '.emote-ac-row img{flex:0 0 28px;width:28px;height:28px;object-fit:contain;}',
        '.emote-ac-row span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
        '.emote-ac-row .emote-ac-sound{flex:0 0 auto;font-weight:400;}',
        '.emote-ac-row.is-active{color:#fff;background:#3a3f55;}',
        '.emote-ac-row:focus{outline:none;}',
        '.emote-ac-hint{position:sticky;bottom:0;padding:4px 8px;color:#999;border-top:1px solid #000;',
        'background:#141417;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.emote-ac-hint b{padding:0 4px;color:#ddd;border:1px solid #555;border-radius:3px;font-weight:400;}',
        '.emote-ac-hint i{display:inline-grid;font-style:normal;}',
        '.emote-ac-hint i span{grid-area:1/1;}'
    ].join('');
    document.head.appendChild(style);

    var panel = document.createElement('div');
    panel.id = 'emote-ac';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', 'Matching emotes');
    panel.hidden = true;
    document.body.appendChild(panel);

    var matches = [];
    var activeIndex = -1;
    var shownToken = '';
    var dismissedToken = '';
    var blurTimer = 0;
    var keyPicked = false;
    var tabList = null;
    var tabStart = 0;

    function allEmotes() {
        var list = (window.CHANNEL && Array.isArray(CHANNEL.emotes)) ? CHANNEL.emotes : [];
        return list.filter(function (emote) {
            return emote && typeof emote.name === 'string' && emote.name;
        });
    }

    // The sound emotes block, if this channel JS has one and it has run.
    function soundApi() {
        var api = window.__wideamariSound;
        return api && typeof api.soundOnlyEmotes === 'function' && typeof api.hasSound === 'function' ? api : null;
    }

    // Channel emotes plus the sound-only names (a real emote with the same
    // name wins, as it does in chat).
    function listedEmotes() {
        var list = allEmotes();
        var api = soundApi();
        if (!api) return list;
        var taken = {};
        list.forEach(function (emote) { taken[emote.name] = true; });
        return list.concat(api.soundOnlyEmotes().filter(function (emote) {
            return emote && typeof emote.name === 'string' && emote.name && !taken[emote.name];
        }));
    }

    function hasSound(emote) {
        var api = soundApi();
        return !!(api && api.hasSound(emote.name));
    }

    // The most common first character of the emote names, if it isn't a
    // letter or digit; "/" if there is none.
    function emotePrefix() {
        var counts = {};
        var best = '/', bestCount = 0;
        allEmotes().forEach(function (emote) {
            var c = emote.name.charAt(0);
            if (/[\w\s]/.test(c)) return;
            counts[c] = (counts[c] || 0) + 1;
            if (counts[c] > bestCount) {
                best = c;
                bestCount = counts[c];
            }
        });
        return best;
    }

    function isToken(text) {
        return text.length > 1 && text.charAt(0) === emotePrefix();
    }

    function findEmotes(token) {
        var list = listedEmotes();
        var lower = token.toLowerCase();
        var rest = lower.slice(1);
        var prefix = [], contains = [];
        list.forEach(function (emote) {
            var name = emote.name.toLowerCase();
            if (name.indexOf(lower) === 0) prefix.push(emote);
            else if (name.indexOf(rest) !== -1) contains.push(emote);
        });
        var byName = function (a, b) {
            return a.name.localeCompare(b.name);
        };
        return prefix.sort(byName).concat(contains.sort(byName)).slice(0, MAX);
    }

    // The emotes CyTube's tab completion chooses from, in its order.
    // Channel emotes only: CyTube's Tab cannot complete sound-only names.
    function tabCandidates(incomplete) {
        var lower = incomplete.toLowerCase();
        return allEmotes().filter(function (emote) {
            return emote.name.toLowerCase().indexOf(lower) === 0;
        }).sort(function (a, b) {
            var x = a.name.toLowerCase(), y = b.name.toLowerCase();
            return x > y ? 1 : x < y ? -1 : 0;
        });
    }

    function readToken() {
        var caret = chatline.selectionEnd;
        if (typeof caret !== 'number') return null;
        var word = /\S*$/.exec(chatline.value.slice(0, caret))[0];
        return { text: word, start: caret - word.length, end: caret };
    }

    function isOpen() { return !panel.hidden; }

    function close() {
        clearTimeout(blurTimer);
        panel.hidden = true;
        panel.textContent = '';
        matches = [];
        activeIndex = -1;
        keyPicked = false;
        tabList = null;
        shownToken = '';
    }

    function place() {
        var r = chatline.getBoundingClientRect();
        panel.style.left = Math.round(r.left) + 'px';
        panel.style.maxWidth = Math.round(r.width) + 'px';
        panel.style.bottom = Math.round(window.innerHeight - r.top + 4) + 'px';
    }

    // Key hints at the bottom of the list, for its current state.
    function updateHint() {
        var hint = panel.querySelector('.emote-ac-hint');
        if (!hint) return;
        // Same keys in the same places in every state; only what they do
        // changes. Each word takes the width of its longest alternative, so
        // nothing moves.
        var keys = [
            ['Tab', ['complete', 'next'], tabList ? 1 : 0],
            ['\u2191\u2193', ['select', 'history'], tabList ? 1 : 0],
            ['Enter', ['close', 'insert'], keyPicked ? 1 : 0],
            ['Esc', ['close'], 0]
        ];
        hint.textContent = '';
        keys.forEach(function (k, i) {
            var name = document.createElement('b');
            var words = document.createElement('i');
            name.textContent = k[0];
            k[1].forEach(function (text, j) {
                var word = document.createElement('span');
                word.textContent = text;
                if (j !== k[2]) word.style.visibility = 'hidden';
                words.appendChild(word);
            });
            hint.appendChild(document.createTextNode(i ? ' \u00b7 ' : ''));
            hint.appendChild(name);
            hint.appendChild(document.createTextNode(' '));
            hint.appendChild(words);
        });
    }

    function setActive(index, scroll) {
        var rows = panel.querySelectorAll('.emote-ac-row');
        if (!rows.length) return;
        activeIndex = (index + rows.length) % rows.length;
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.toggle('is-active', i === activeIndex);
            rows[i].setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        }
        updateHint();
        if (!scroll) return;
        var el = rows[activeIndex];
        // The hint covers the bottom of the list.
        var visible = panel.clientHeight - panel.querySelector('.emote-ac-hint').offsetHeight;
        if (el.offsetTop < panel.scrollTop) panel.scrollTop = el.offsetTop;
        else if (el.offsetTop + el.offsetHeight > panel.scrollTop + visible) {
            panel.scrollTop = el.offsetTop + el.offsetHeight - visible;
        }
    }

    function render() {
        panel.textContent = '';
        matches.forEach(function (emote, index) {
            var row = document.createElement('button');
            var img = document.createElement('img');
            var label = document.createElement('span');
            row.type = 'button';
            row.className = 'emote-ac-row';
            row.tabIndex = -1;
            row.dataset.index = String(index);
            row.setAttribute('role', 'option');
            img.loading = 'lazy';
            img.src = emote.image || '';
            img.alt = '';
            label.textContent = emote.name;
            row.appendChild(img);
            row.appendChild(label);
            if (hasSound(emote)) {
                var mark = document.createElement('span');
                mark.className = 'emote-ac-sound';
                mark.textContent = '🔊';
                mark.title = 'Plays a sound';
                row.appendChild(mark);
            }
            panel.appendChild(row);
        });
        var hint = document.createElement('div');
        hint.className = 'emote-ac-hint';
        panel.appendChild(hint);
        updateHint();
        panel.scrollTop = 0;
    }

    function refresh(event) {
        if (tabList) {
            // Keep the Tab list open while Tab is pressed again.
            if (event.type === 'keyup' && /^(Tab|Shift|Control|Alt|Meta)$/.test(event.key)) return;
            close();
        }
        var token = readToken();
        var text = token ? token.text : '';
        if (text !== dismissedToken) dismissedToken = '';
        if (!token || !isToken(text) || text === dismissedToken) {
            if (isOpen()) close();
            return;
        }
        if (isOpen() && text === shownToken) {
            place();
            return;
        }
        // Only typing opens the list; caret moves and history browsing just update or close it.
        if (!isOpen() && event.type !== 'input') return;
        matches = findEmotes(text);
        if (!matches.length) {
            if (isOpen()) close();
            return;
        }
        shownToken = text;
        activeIndex = -1;
        keyPicked = false;
        render();
        panel.hidden = false;
        place();
    }

    // Runs after CyTube's tab completion. incomplete: the word before the
    // caret before Tab was pressed.
    function afterTab(incomplete) {
        var caret = chatline.selectionEnd;
        if (typeof caret !== 'number') return;
        // The word Tab completed to, and the space CyTube adds after a full completion.
        var completed = /(\S*) ?$/.exec(chatline.value.slice(0, caret));
        if (incomplete) {
            var list = tabCandidates(incomplete);
            if (list.length < 2) {
                if (isOpen()) close();
                return;
            }
            close();
            tabList = list;
            matches = list;
            render();
            panel.hidden = false;
            place();
        } else if (!tabList) {
            // A further Tab after a full completion (caret after its space)
            // is only part of a cycle if the list is still shown.
            return;
        }
        tabStart = caret - completed[0].length;
        var active = -1;
        tabList.forEach(function (emote, i) {
            if (emote.name === completed[1]) active = i;
        });
        if (active >= 0) {
            setActive(active, true);
        } else {
            activeIndex = -1;
            var rows = panel.querySelectorAll('.emote-ac-row');
            for (var i = 0; i < rows.length; i++) rows[i].classList.remove('is-active');
        }
    }

    function insert(index) {
        var emote = matches[index];
        var token = readToken();
        if (token && tabList) token = { start: tabStart, end: token.end };
        if (!emote || !token) {
            close();
            return;
        }
        chatline.setRangeText(emote.name + ' ', token.start, token.end, 'end');
        close();
        chatline.focus();
    }

    chatline.addEventListener('keydown', function (event) {
        if (event.isComposing) return;
        if (event.key === 'Tab') {
            // Left to CyTube's handler; look at the result afterwards.
            var before = readToken();
            var incomplete = before ? before.text : '';
            setTimeout(function () { afterTab(incomplete); }, 0);
            return;
        }
        if (!isOpen()) return;
        // While the list is open, Enter never sends: it inserts the emote
        // picked with the arrows, or just closes the list.
        if (event.key === 'Enter') {
            if (!tabList && keyPicked && activeIndex >= 0) {
                insert(activeIndex);
            } else {
                dismissedToken = shownToken;
                close();
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        // The Tab list is only a preview; other keys work as without it.
        if (tabList) return;
        switch (event.key) {
            case 'ArrowDown':
                keyPicked = true;
                setActive(activeIndex + 1, true);
                break;
            case 'ArrowUp':
                keyPicked = true;
                setActive(activeIndex < 0 ? -1 : activeIndex - 1, true);
                break;
            case 'Escape':
                dismissedToken = shownToken;
                close();
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
    chatline.addEventListener('input', refresh);
    chatline.addEventListener('keyup', refresh);
    chatline.addEventListener('blur', function () {
        clearTimeout(blurTimer);
        blurTimer = setTimeout(close, 150);
    });
    chatline.addEventListener('focus', function () {
        clearTimeout(blurTimer);
    });

    function rowFrom(event) {
        var row = event.target.closest ? event.target.closest('.emote-ac-row') : null;
        return row && panel.contains(row) ? row : null;
    }

    panel.addEventListener('mousedown', function (event) {
        if (rowFrom(event)) event.preventDefault();
    });
    panel.addEventListener('mousemove', function (event) {
        if (!event.movementX && !event.movementY) return;
        var row = rowFrom(event);
        if (row && Number(row.dataset.index) !== activeIndex) setActive(Number(row.dataset.index), false);
    });
    panel.addEventListener('click', function (event) {
        var row = rowFrom(event);
        if (row) insert(Number(row.dataset.index));
    });

    window.addEventListener('resize', function () {
        if (isOpen()) place();
    });
    window.addEventListener('scroll', function () {
        if (isOpen()) place();
    }, true);
})();
/*! "/" emote dropdown end */

/*! sound emotes start */
(function () {
    'use strict';

    // ================= SOUNDS: edit this list, one line per sound =================
    // Two kinds of line:
    //
    // 1. Attach a sound to an emote the channel already has:
    //      { emote: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },
    //    Posting /doroclap shows the normal emote image AND plays the sound.
    //
    // 2. A sound-only name that borrows another emote's picture:
    //      { name: '/doroclapsound', look: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },
    //    Posting /doroclapsound shows the /doroclap image with a gold border and plays the sound.
    //    The name must not also be a real channel emote (the real emote would win).
    //
    // Names are case-sensitive and must stand alone as a word, the same as normal emotes.
    // Every line ends with a comma. Lines starting with // are switched off.
    var SOUNDS = [
        { name: '/doroclapsound', look: '/doroclap', url: 'https://nostramadeus.github.io/wideamari-js/sounds/doroclap-3s.mp3' },
        // { emote: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },
    ];

    var COOLDOWN_MS = 10000;          // the same sound plays at most once per 10 s for each viewer
    var STORE_KEY = 'wideamari-sound'; // localStorage: { "on": true, "volume": 40 }
    var DEFAULTS = { on: true, volume: 40 };

    // If the owner saves new channel JS while people are watching, CyTube runs this block again.
    // Undo the previous run first so there is only one button and one chat listener.
    var previous = window.__wideamariSound;
    if (previous && typeof previous.teardown === 'function') {
        try { previous.teardown(); } catch (err) { console.error('sound emotes teardown:', err); }
    }
    // The untouched CyTube execEmotes, kept across re-runs so wrappers never stack.
    var originalExecEmotes = (previous && previous.originalExecEmotes) || window.execEmotes;

    var loadedAt = Date.now();        // chat messages older than this (join history) never play
    var lastMessageTime = 0;          // newest chat message time seen (server clock)
    var lastMessageKey = '';          // to drop the same message sent again after a reconnect
    var lastPlayed = {};              // sound url -> Date.now() of its last play
    var audioByUrl = {};
    var settings = readSettings();

    // ---------- matching ----------

    // Chat text arrives HTML-escaped, so names are compared in their escaped form (as CyTube does).
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function entryKey(entry) {
        return entry.name || entry.emote;
    }

    var usableSounds = SOUNDS.filter(function (entry) {
        return entry && typeof entryKey(entry) === 'string' && entryKey(entry) !== '';
    });

    var soundOnlyByToken = {};
    usableSounds.forEach(function (entry) {
        if (entry.name) soundOnlyByToken[escapeHtml(entry.name)] = entry;
    });

    // The sound urls a message triggers: each emote/name counts when it stands alone as a word
    // (split on whitespace, like CyTube's emote matching). Each url at most once per message.
    function soundsInMessage(msg) {
        var tokens = {};
        String(msg || '').split(/\s+/).forEach(function (token) {
            if (token) tokens[token] = true;
        });
        var urls = [];
        usableSounds.forEach(function (entry) {
            if (!entry.url) return;
            if (tokens[escapeHtml(entryKey(entry))] && urls.indexOf(entry.url) === -1) {
                urls.push(entry.url);
            }
        });
        return urls;
    }

    // True only for a message posted after this script loaded and not seen before.
    // Mirrors CyTube's own chat filters, so a message that is not shown does not play.
    function isFreshMessage(data) {
        if (!data || typeof data.msg !== 'string') return false;
        var time = typeof data.time === 'number' ? data.time : Date.now();
        if (time < loadedAt) return false;                        // join history
        var key = time + '\n' + data.username + '\n' + data.msg;
        if (time < lastMessageTime) return false;                 // resent after reconnect
        if (time === lastMessageTime && key === lastMessageKey) return false;
        lastMessageTime = time;
        lastMessageKey = key;
        if (window.IGNORED && window.IGNORED.indexOf(data.username) !== -1) return false;
        var meta = data.meta || {};
        if (meta.shadow && !(window.USEROPTS && window.USEROPTS.show_shadowchat)) return false;
        return true;
    }

    // ---------- playing ----------

    function getAudio(url) {
        if (!audioByUrl[url]) {
            var audio = new Audio(url);
            audio.preload = 'auto';
            audioByUrl[url] = audio;
        }
        return audioByUrl[url];
    }

    function playSound(url) {
        var now = Date.now();
        if (lastPlayed[url] !== undefined && now - lastPlayed[url] < COOLDOWN_MS) return false;
        lastPlayed[url] = now;
        var audio = getAudio(url);
        audio.volume = settings.volume / 100;
        try {
            audio.pause();
            audio.currentTime = 0;
            var playing = audio.play();
            // Browsers block sound until the viewer has clicked the page once; nothing to do then.
            if (playing && typeof playing.catch === 'function') playing.catch(function () {});
        } catch (err) { /* same: blocked or not supported */ }
        return true;
    }

    function onChatMsg(data) {
        if (!isFreshMessage(data)) return;
        if (!settings.on) return;
        soundsInMessage(data.msg).forEach(playSound);
    }

    function preloadAll() {
        usableSounds.forEach(function (entry) {
            if (entry.url) getAudio(entry.url);
        });
    }

    // ---------- showing sound-only names ----------
    // CHANNEL.emotes is left alone: the emote editor and Export read it, so extra entries there
    // could be saved to the server by accident. Instead the chat message HTML is post-processed
    // right after CyTube's own execEmotes, reading the borrowed picture at that moment.
    // The "/" dropdown lists them through window.__wideamariSound (end of this block).

    function lookImage(lookName) {
        var channel = window.CHANNEL || {};
        var map = channel.emoteMap || {};
        var key = escapeHtml(lookName);
        if (Object.prototype.hasOwnProperty.call(map, key) && map[key].image) return map[key].image;
        var list = Array.isArray(channel.emotes) ? channel.emotes : [];
        for (var i = 0; i < list.length; i++) {
            if (list[i] && list[i].name === lookName && list[i].image) return list[i].image;
        }
        return '';
    }

    function addSoundOnlyImages(html) {
        if (window.USEROPTS && window.USEROPTS.no_emotes) return html;
        return String(html).replace(/[^\s]+/g, function (token) {
            if (!Object.prototype.hasOwnProperty.call(soundOnlyByToken, token)) return token;
            var entry = soundOnlyByToken[token];
            var image = lookImage(entry.look);
            if (!image) return token;
            var img = document.createElement('img');
            img.className = 'channel-emote wideamari-sound-emote';
            img.title = entry.name;
            img.src = image;
            return img.outerHTML;
        });
    }

    var wrappedExecEmotes = null;
    if (typeof originalExecEmotes === 'function') {
        wrappedExecEmotes = function (msg) {
            return addSoundOnlyImages(originalExecEmotes.apply(this, arguments));
        };
        window.execEmotes = wrappedExecEmotes;
    }

    // Chat lines already on screen (join history) were drawn before this file loaded, so their
    // sound-only names are still plain text. Swap those words for the bordered picture (no sound).
    function rescanHistory() {
        var buffer = document.getElementById('messagebuffer');
        if (!buffer || (window.USEROPTS && window.USEROPTS.no_emotes)) return;
        var walker = document.createTreeWalker(buffer, NodeFilter.SHOW_TEXT);
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function (node) {
            var parts = node.nodeValue.split(/(\s+)/);
            var changed = false;
            var fragment = document.createDocumentFragment();
            parts.forEach(function (part) {
                if (Object.prototype.hasOwnProperty.call(soundOnlyByToken, escapeHtml(part))) {
                    var entry = soundOnlyByToken[escapeHtml(part)];
                    var image = lookImage(entry.look);
                    if (image) {
                        var img = document.createElement('img');
                        img.className = 'channel-emote wideamari-sound-emote';
                        img.title = entry.name;
                        img.src = image;
                        fragment.appendChild(img);
                        changed = true;
                        return;
                    }
                }
                fragment.appendChild(document.createTextNode(part));
            });
            if (changed && node.parentNode) node.parentNode.replaceChild(fragment, node);
        });
    }
    rescanHistory();
    // The emote list may arrive after this file loads; try again shortly after.
    var rescanTimer = setTimeout(rescanHistory, 2000);

    // ---------- settings ----------

    function readSettings() {
        var result = { on: DEFAULTS.on, volume: DEFAULTS.volume };
        try {
            var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
            if (saved && typeof saved.on === 'boolean') result.on = saved.on;
            if (saved && typeof saved.volume === 'number' && isFinite(saved.volume)) {
                result.volume = Math.max(0, Math.min(100, Math.round(saved.volume)));
            }
        } catch (err) { /* broken or blocked storage: use defaults */ }
        return result;
    }

    function saveSettings() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch (err) { /* ignore */ }
    }

    // ---------- viewer controls: speaker button + small panel ----------

    var ICON_ON = '🔊';  // speaker with sound waves
    var ICON_OFF = '🔇'; // speaker with a line through it

    var style = document.createElement('style');
    style.id = 'wideamari-sound-style';
    style.textContent = [
        'img.channel-emote.wideamari-sound-emote{border:2px solid #e6b422;border-radius:4px;}',
        '#wideamari-sound-panel{position:fixed;z-index:10000;width:200px;box-sizing:border-box;padding:8px 10px;',
        'color:#eee;background:#1b1b1f;border:1px solid #000;border-radius:4px;box-shadow:0 6px 16px rgba(0,0,0,.55);font-size:14px;}',
        '#wideamari-sound-panel[hidden]{display:none;}',
        '#wideamari-sound-panel label{display:flex;align-items:center;gap:6px;margin:0 0 6px;font-weight:400;cursor:pointer;}',
        '#wideamari-sound-panel .wideamari-sound-volume{display:flex;align-items:center;gap:6px;}',
        '#wideamari-sound-panel input[type=range]{flex:1;min-width:0;margin:0;}',
        '#wideamari-sound-panel .wideamari-sound-value{width:3em;text-align:right;}'
    ].join('');
    document.head.appendChild(style);

    var button = document.createElement('button');
    button.id = 'wideamari-sound-btn';
    button.type = 'button';
    button.className = 'btn btn-sm btn-default';
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');

    var panel = document.createElement('div');
    panel.id = 'wideamari-sound-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Sound emote settings');

    var onLabel = document.createElement('label');
    var onBox = document.createElement('input');
    onBox.type = 'checkbox';
    onLabel.appendChild(onBox);
    onLabel.appendChild(document.createTextNode('Sound emotes on'));

    var volumeRow = document.createElement('div');
    volumeRow.className = 'wideamari-sound-volume';
    var volumeText = document.createElement('span');
    volumeText.textContent = 'Volume';
    var volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.step = '1';
    volumeSlider.setAttribute('aria-label', 'Sound emote volume');
    var volumeValue = document.createElement('span');
    volumeValue.className = 'wideamari-sound-value';
    volumeRow.appendChild(volumeText);
    volumeRow.appendChild(volumeSlider);
    volumeRow.appendChild(volumeValue);

    panel.appendChild(onLabel);
    panel.appendChild(volumeRow);
    document.body.appendChild(panel);

    function showSettings() {
        button.textContent = settings.on ? ICON_ON : ICON_OFF;
        button.title = 'Sound emotes: ' + (settings.on ? 'on' : 'off') + ', volume ' + settings.volume + '%';
        onBox.checked = settings.on;
        volumeSlider.value = String(settings.volume);
        volumeSlider.disabled = !settings.on;
        volumeValue.textContent = settings.volume + '%';
        volumeSlider.setAttribute('aria-valuetext', settings.volume + ' percent');
    }

    function placePanel() {
        var rect = button.getBoundingClientRect();
        var left = Math.max(4, Math.min(rect.left, window.innerWidth - panel.offsetWidth - 4));
        panel.style.left = Math.round(left) + 'px';
        // Open above the button when there is room, else below it.
        if (rect.top > panel.offsetHeight + 8) {
            panel.style.top = '';
            panel.style.bottom = Math.round(window.innerHeight - rect.top + 4) + 'px';
        } else {
            panel.style.bottom = '';
            panel.style.top = Math.round(rect.bottom + 4) + 'px';
        }
    }

    function openPanel() {
        panel.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        placePanel();
    }

    function closePanel() {
        panel.hidden = true;
        button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', function (event) {
        event.preventDefault();
        if (panel.hidden) openPanel(); else closePanel();
    });

    onBox.addEventListener('change', function () {
        settings.on = onBox.checked;
        if (settings.on) preloadAll();
        else Object.keys(audioByUrl).forEach(function (url) { audioByUrl[url].pause(); });
        saveSettings();
        showSettings();
    });

    volumeSlider.addEventListener('input', function () {
        settings.volume = Math.max(0, Math.min(100, Math.round(Number(volumeSlider.value) || 0)));
        Object.keys(audioByUrl).forEach(function (url) { audioByUrl[url].volume = settings.volume / 100; });
        saveSettings();
        showSettings();
    });

    function onDocumentClick(event) {
        if (panel.hidden) return;
        if (panel.contains(event.target) || button.contains(event.target)) return;
        closePanel();
    }

    function onDocumentKey(event) {
        if (event.key === 'Escape' && !panel.hidden) {
            closePanel();
            button.focus();
        }
    }

    function onWindowMove() {
        if (!panel.hidden) placePanel();
    }

    document.addEventListener('mousedown', onDocumentClick, true);
    document.addEventListener('keydown', onDocumentKey);
    window.addEventListener('resize', onWindowMove);
    window.addEventListener('scroll', onWindowMove, true);

    // Next to the Emote List button; fallbacks if a layout moved it.
    var placeTries = 0;
    var placeTimer = 0;
    function placeButton() {
        var emoteListButton = document.getElementById('emotelistbtn');
        var leftControls = document.getElementById('leftcontrols');
        var chatline = document.getElementById('chatline');
        if (emoteListButton && emoteListButton.parentNode) {
            emoteListButton.insertAdjacentElement('afterend', button);
        } else if (leftControls) {
            leftControls.appendChild(button);
        } else if (chatline && chatline.parentNode && placeTries >= 10) {
            chatline.insertAdjacentElement('afterend', button);
        } else if (placeTries < 20) {
            placeTries++;
            placeTimer = setTimeout(placeButton, 500);
            return;
        }
    }

    showSettings();
    placeButton();
    if (settings.on) preloadAll();

    if (window.socket && typeof window.socket.on === 'function') {
        window.socket.on('chatMsg', onChatMsg);
    } else {
        console.error('sound emotes: no CyTube socket found');
    }

    function teardown() {
        clearTimeout(placeTimer);
        clearTimeout(rescanTimer);
        if (window.socket && typeof window.socket.off === 'function') window.socket.off('chatMsg', onChatMsg);
        if (wrappedExecEmotes && window.execEmotes === wrappedExecEmotes) window.execEmotes = originalExecEmotes;
        Object.keys(audioByUrl).forEach(function (url) { audioByUrl[url].pause(); });
        document.removeEventListener('mousedown', onDocumentClick, true);
        document.removeEventListener('keydown', onDocumentKey);
        window.removeEventListener('resize', onWindowMove);
        window.removeEventListener('scroll', onWindowMove, true);
        [button, panel, style].forEach(function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);
        });
    }

    // ---------- for the "/" emote dropdown block (it reads these at lookup time) ----------

    // Sound-only names as dropdown entries: their own name, the borrowed picture.
    function soundOnlyEmotes() {
        return usableSounds.filter(function (entry) { return entry.name; }).map(function (entry) {
            return { name: entry.name, image: lookImage(entry.look) };
        });
    }

    // True for every name in SOUNDS, both kinds.
    function hasSound(name) {
        return usableSounds.some(function (entry) { return entryKey(entry) === name; });
    }

    window.__wideamariSound = {
        teardown: teardown,
        originalExecEmotes: originalExecEmotes,
        soundOnlyEmotes: soundOnlyEmotes,
        hasSound: hasSound
    };
})();
/*! sound emotes end */
