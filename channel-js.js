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

/*! "/" emote dropdown + sound emotes: loaded via External Javascript https://nostramadeus.github.io/wideamari-js/wideamari-extra.js (readable source https://github.com/Nostramadeus/wideamari-js; old dropdown source https://ghostbin.lain.la/paste/85roa) */