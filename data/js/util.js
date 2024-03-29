

function addCSS(css, el = null) {
    if (el == null) el = (document.head || document.documentElement);
    let style = document.createElement('style');
    style.innerHTML = css;
    el.append(style);
    return style;
}

function applyStyleToElement(el, style) {
    for (let i in style) {
        el.style[i] = style[i];
    }
}

function showinfo(text, level = 'info', time = 5000, animation_time = 500, id = null) {
    let el = document.createElement('div');
    el.classList.add('cb06ab0e192b');

    el.setAttribute('data-level', level);

    el.unionId = String(getRandom(100000, 999999));
    if (!id) id = 'cb06ab0e192b:' + el.unionId;
    el.id = id;

    el.append(document.createTextNode(text));
    let closebtn = document.createElement('button');
    closebtn.innerHTML = 'x';
    closebtn.classList.add('x');
    closebtn.onclick = el.remove.bind(el);
    el.append(closebtn);

    (document.body || document.documentElement).append(el);
    
    let bh = el.clientHeight;
    addCSS(`
    @keyframes cb06ab0e192b_${el.unionId}-out {
        from { top: 10px }
        to { top: ${-bh}px }
    }
    @keyframes cb06ab0e192b_${el.unionId}-in {
        from { top: ${-bh}px }
        to { top: 10px }
    }`, el);

    el.style.top = '10px';
    el.style.animation = `cb06ab0e192b_${el.unionId}-in ${animation_time}ms linear 1`;
    
    if (!time) return el;
    
    setTimeout(function () {
        el.style.animation = `cb06ab0e192b_${el.unionId}-out ${animation_time}ms linear 1`;
        el.style.top = `${-bh-100}px`;
        setTimeout(el.remove.bind(el), 2 * animation_time);
    }, time);

    return el;
} // function showinfo

addCSS(`
.cb06ab0e192b {
    position: fixed;
    top: -100%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 60%;
    text-align: left;
    color: var(--color);
    background: var(--background);
    border: 1px solid;
    border-color: var(--bordercolor);
    border-radius: 10px;
    z-index: 1048574;
    padding: 10px;
    
    --color: black;
    --background: white;
    --bordercolor: black;
}
.cb06ab0e192b[data-level="info"] {
    --background: lightgreen;
    --bordercolor: green;
}
.cb06ab0e192b[data-level="warn"] {
    --background: orange;
    --bordercolor: #ffb100;
}
.cb06ab0e192b[data-level="error"] {
    --background: #ffccbb;
    --bordercolor: red;
}
.cb06ab0e192b .x {
    float: right;
}`);

function requestInput(prompt = '') {
    return new Promise(function (resolve, reject) {
        let el = document.createElement('div');
        el.innerHTML =
            `<div style="position:fixed;left:0;right:0;top:0;bottom:0;` +
            `z-index:134217726;background:#000;opacity:0.1;"></div>` +
            `<div style="position:fixed;left:50%;top:50%;` +
            `width:50%;height:50%;transform:translate(-50%,-50%);` +
            `z-index:134217727;background:white;border:1px solid #ccc;` +
            `padding:10px;display:flex;flex-direction:column;">` +
            `<div class="prompt" style="margin-bottom:5px"></div>` +
            `<div class="edit" style="flex:1;border:1px solid;` +
            `margin-bottom:5px;overflow:auto" contenteditable></div>` +
            `<div class="button" style="text-align:center">` +
            `<button data-ok style="margin-right:10px">OK</button>` +
            `<button data-cancel>Cancel</button></div>` +
            `</div>`;
        el.querySelector('.prompt').innerText = prompt;
        el.querySelector('.button [data-ok]').onclick = function () {
            let val = el.querySelector('.edit').innerText;
            el.remove();
            resolve(val);
        };
        el.querySelector('.button [data-cancel]').onclick = function () {
            let val = el.querySelector('.edit').innerText;
            el.remove();
            reject(val);
        };
        (document.body || document.documentElement).append(el);
        el.querySelector('.edit').focus();
    })
} // function requireInput()

function getRandom(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



async function LoadChunk(chunk_base, chunk_width = 1, chunk_height = 1, callback = null) {
    let blob = await LoadChunkEx({
        chunk_base,
        chunk_width,
        chunk_height,
        callback
    });
    try {
        return await blob.text();
    }
    catch (_) {
        return await (new Response(blob)).text();
    }
}
async function LoadChunkEx({chunk_base, chunk_width = 1, chunk_height = 1, callback = null}) {
    if (typeof(chunk_base) !== 'string' || !chunk_width || !chunk_height) throw new TypeError(87);

    let chunkstr = '';
    let chunkresult = [];
    for (let h = 0; h < chunk_height; ++h) {
        for (let w = 0; w < chunk_width; ++w) {
            chunkstr = `chunk-${h}-${w}`;
            chunkstr = chunk_base + '/' + chunkstr;
            try {
                let fetchresult = await fetch(chunkstr);
                if (!fetchresult.ok) throw new Error(`Error ${fetchresult.status}`);
                chunkresult.push(await fetchresult.blob());
            }
            catch (error) {
                throw new Error(`Failed to load chunk-${h}-${w} in ${chunk_base}:\n` + error);
            }
            if (callback) try { callback(w, h); } catch (_) { console.error('Error during callback:\n', _) };
        }
    }

    return new Blob(chunkresult);

}

function enableformitem(form, bEnable = true) {
    form.querySelectorAll('input,button,select').forEach(el=>el.disabled=!bEnable);
    form[(bEnable?'remove':'set')+'Attribute']('disabled', true);
}


{
    const showTip_style = {
        position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, outline: 0,
        zIndex: 2097152, background: 'rgba(0, 0, 0, 0.5)', cursor: 'not-allowed',
        userSelect: 'none',
    };
    const showTip_style_2 = {
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        background: 'var(--color-scheme-background, #ffffff)',
        border: '1px solid gray',
        padding: '10px',
        cursor: 'default',
        maxHeight: 'calc(100% - 30px)', overflow: 'auto',
    };
    function showTip(content, html = false, time = 0) {
        const current_focus = document.querySelector(':focus');
        const el = document.createElement('div');
        el.role = 'dialog';
        const style1 = document.createElement('style');
        style1.innerText = `*, html, body { overflow: hidden; }`;
        el.append(style1);
        for (const i in showTip_style) el.style[i] = showTip_style[i];
        const cont = document.createElement('div');
        for (const i in showTip_style_2) cont.style[i] = showTip_style_2[i];
        el.tabIndex = 1;
        el.append(cont);
        let closed = false, onclose = null;
        const evt = new EventTarget();
        Object.defineProperties(evt, {
            close: { value: close, enumerable: true },
            closed: { get() { return closed }, enumerable: true },
            el: { value: function () { return el }, enumerable: true },
            onclose: {
                get() { return onclose },
                set(val) {
                    val ? evt.addEventListener('close', val) : evt.removeEventListener('close', onclose);
                    onclose = val;
                    return true;
                },
            },
        })
        // console.log(evt);
        function close() {
            el.remove();
            closed = true;
            evt.dispatchEvent(new CustomEvent('close'));
        };
        evt.addEventListener('close', function () {
            queueMicrotask(() => current_focus.focus());
        });

        cont[html ? 'innerHTML' : 'innerText'] = content;
        el.onkeydown = el.onpointerdown = ev => ev.preventDefault();
        el.onkeyup = el.onpointerup = ev => ev.preventDefault();
        const ignoreKeys = ['Home', 'End', 'Control', 'Shift', 'Alt', 'Tab',];
        const handlers = () => {
            el.onclick = () => close();
            el.onkeydown = (ev) => {
                if (ev.key === 'ArrowDown') cont.scrollBy({ left: 0, top: 10, behavior: 'smooth' });
                else if (ev.key === 'ArrowUp') cont.scrollBy({ left: 0, top: -10, behavior: 'smooth' });
                else if (ev.key === 'PageDown') cont.scrollBy({ left: 0, top: cont.clientHeight, behavior: 'smooth' });
                else if (ev.key === 'PageUp') cont.scrollBy({ left: 0, top: -cont.clientHeight, behavior: 'smooth' });
                else if (ignoreKeys.includes(ev.key)) { }
                else if (ev.ctrlKey || ev.shiftKey || ev.altKey) { }
                else el._flag = true;
            };
            el.onkeyup = () => { el._flag && close() };
        };
        if (time) setTimeout(handlers, time);
        else queueMicrotask(handlers);

        (document.body || document.documentElement).append(el);
        el.focus();

        return evt;
    }
    globalThis.showTip = showTip;
}


if (window.dependencies) dependencies.done('util.js');


