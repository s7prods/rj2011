

function addCSS(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    (document.head || document.documentElement).append(style);
    return style;
}

function showinfo(text, level = 'info', time = 5000) {
    let el = document.createElement('div');
    el.classList.add('cb06ab0e192b');

    el.setAttribute('data-level', level);

    el.innerText = text;
    let closebtn = document.createElement('button');
    closebtn.innerHTML = 'x';
    closebtn.classList.add('x');
    closebtn.onclick = el.remove.bind(el);
    el.append(closebtn);

    (document.body || document.documentElement).append(el);
    var bh = el.clientHeight;
    var bt = -bh;
    var _i1 = setInterval(function () {
        el.style.top = (bt += 1) + 'px';
        if (bt >= 10) {
            el.style.top = 10;
            clearInterval(_i1);
        }
    }, 10);
    setTimeout(function () {
        bt = 10;
        var _i2 = setInterval(function () {
            el.style.top = (bt -= 1) + 'px';
            if (bt < -bh) {
                clearInterval(_i2);
                el.remove();
            }
        }, 10);
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


