(async function (global, doc) {
    await dependencies.on('data_init.js', 'util.js');

    const cbd = 'EULA_viewer-da72eae4-backdrop';
    const cct = 'EULA_viewer-da72eae4-content';

    const root = doc.createElement('div');
    const backdrop = doc.createElement('div');
    const content = doc.createElement('div');
    backdrop.classList.add(cbd);
    content.classList.add(cct);
    addCSS(`
    * {
        user-select: none;
        pointer-events: none;
    }
    .${cbd}, .${cct} {
        position: fixed;
        z-index: 1073741823;
    }
    .${cbd} {
        left: 0; right: 0; top: 0; bottom: 0;
        cursor: not-allowed;
        background: black; opacity: 0.5;
    }
    .${cct} {
        transition: 0.3s;
        left: 50%; top: 50%; transform: translate(-50%, -50%);
        background: white;
        border: 1px outset gray;
        margin: 0; padding: 10px;
        min-width: 50%; min-height: 50%;
        max-width: calc(100% - 25px); max-height: calc(100% - 25px);
        overflow: auto;
        display: flex; flex-direction: column;
    }
    .${cbd}, .${cct}, .${cct} *, .cb06ab0e192b * {
        pointer-events: auto;
    }
    @media screen and (max-width: 500px) {
        .${cct} {
            min-width: calc(100% - 25px);
        }
    }
    .${cct}.fullscreen {
        left: 0; right: 0; top: 0; bottom: 0;
        transform: revert !important;
    }
    .${cct} > .data-block {
        flex: 1;
        font-size: large;
        overflow: auto;
    }
    .${cct} > .data-block > .item {
        margin-bottom: 10px;
    }
    .${cct} > .data-block > .item > .content {
        border: 1px solid #ccc;
        padding: 10px;
        user-select: text;
    }
    .${cct} > .data-block > .item > .content * {
        user-select: text;
    }
    .${cct} > .data-block > .item > .content:not(.open) {
        display: none;
    }
    .${cct} > .data-block > .item > .content.loading::before {
        content: "正在加载...";
        color: gray;
    }
    .${cct} > .data-block > .item > .content.failed::before {
        content: "加载失败: " attr(data-error);
        color: red;
    }
    .${cct} > .data-block > .item > label {
        display: block;
    }
    .${cct} > .data-block > .item > label:nth-last-child(1) {
        margin-bottom: 50px;
    }
    .${cct} > .fullscreen-button {
        cursor: pointer;
        position: absolute;
        left: 10px; top: 10px;
        width: 16px; height: 16px;
        background-color: white;
        background-image: url(data/index.html/fullscreen-expand.svg);
        background-repeat: no-repeat;
        background-size: 16px;
        border: none;
    }
    .${cct}.fullscreen>.fullscreen-button {
        background-image: url(data/index.html/fullscreen-shrink.svg);
    }
    .${cct} [hidden] {
        display: none !important;
    }
    .cb06ab0e192b {
        z-index: 1073741823;
    }
    `, root);
    root.append(backdrop);
    root.append(content);
    backdrop.style.display = content.style.display = 'none';
    (doc.body || doc.documentElement).append(root);

    function clipKeyboard(ev) {
        if (!/tab/i.test(ev.key)) return;
        for (let i of ev.path) {
            if (i === root) return;
        }
        ev.preventDefault();
        (root.querySelector('a,button,input,select,[tabindex]') || { focus: () => { } }).focus();
    }

    doc.addEventListener('keydown', clipKeyboard, { capture: true });
    doc.addEventListener('keyup', clipKeyboard, { capture: true });

    async function checkEula(id) {
        try {
            const pf = await fetch(`data/main/data/EULA/${id}.html`, { method: 'head' });
            return pf.headers.get('ETag');
        }
        catch { return null }
    }
    async function getEula(id) {
        const resp = await fetch(`data/main/data/EULA/${id}.html`, { method: 'get' });
        return await resp.text();
    }

    const vu = await checkEula('u'); const vp = await checkEula('p');
    if (!vu || !vp) {
        backdrop.style.display = content.style.display = '';
        return content.innerHTML = `<h1 style="color:red">数据加载失败，请尝试刷新页面。</h1>`;
    }

    if (rj2011_data['acceptedEULA.u'] === vu && rj2011_data['acceptedEULA.p'] === vp) return free();

    backdrop.style.display = content.style.display = '';

    let type = '《用户协议》及《隐私政策》';
    if (rj2011_data['acceptedEULA.u'] && rj2011_data['acceptedEULA.p'] ) type += '更新通知';
    if (rj2011_data['acceptedEULA.u'] === vu) type = '《隐私政策》更新通知';
    if (rj2011_data['acceptedEULA.p'] === vp) type = '《用户协议》更新通知';

    let ret_resolve = null;
    let ret_promise = new Promise(function (resolve) { ret_resolve = resolve });


    let $content_html;
    try {
        $content_html = await fetch('data/main/data/EULA/c.html');
        if (!$content_html.ok) throw null;
        $content_html = await $content_html.text()
    } catch { return content.innerHTML = `<h1 style="color:red">数据加载失败，请尝试刷新页面。</h1>`; }
    
    content.innerHTML = $content_html;
    (content.querySelector('.title') || {}).innerText = type;

    content.addEventListener('input', function (ev) {
        if (ev.target.tagName.toLowerCase() !== 'input' || ev.target.type !== 'checkbox') return;
        let el = (ev.target.parentElement.parentElement.querySelector('.content') || {});
        if (el.innerHTML === '' && !ev.target.$accepted) {
            ev.preventDefault();
            ev.target.checked = false;
            showinfo('需要先查看内容。', 'error');
        } else {
            let el2 = ev.target.parentElement.parentElement;
            el2.querySelectorAll('input[type=checkbox]').forEach(el3 => {
                el3.checked = ev.target.checked;
            });

            let _ = true;
            content.querySelectorAll('input[type=checkbox]').forEach(el => {
                if (!el.checked) _ = false;
            });
            content.querySelector('button[data-id=o]').disabled = !_;
        }
    }, { capture: true });
    content.addEventListener('click', function (ev) {
        if (ev.target.tagName.toLowerCase() !== 'a' || !ev.target.classList.contains('btn')) return;
        const el = ev.target.parentElement.parentElement;
        const content = el.querySelector('.content');
        if (content.innerHTML) {
            content.classList.toggle('open');

            if (el.$BindedCheckField) {
                (el.$BindedCheckField || {}).hidden = !content.classList.contains('open');
            }

            return true;
        }
        if (content.classList.contains('loading')) return;
        content.classList.add('open');
        content.classList.remove('failed');
        content.classList.add('loading');
        getEula(el.getAttribute('data-id'))
        .then(function (text) {
            content.classList.remove('loading');
            content.innerHTML = text;

            let el2 = el.querySelector('label');
            if (el2) {
                el2 = el2.cloneNode(true);
                el.append(el2);
                el.$BindedCheckField = el2;
            }
        })
        .catch(function (err) {
            content.innerHTML = '';
            content.classList.add('failed');
            content.classList.remove('loading');
            content.setAttribute('data-error', err);
        });
    }, { capture: true });
    (content.querySelector('button[data-id=o]') || {}).onclick = function () {
        let _ = true;
        content.querySelectorAll('input[type=checkbox]').forEach(el => {
            if (!el.checked) _ = false;
        });
        if (!_) return showinfo('非法请求', 'error');
        ret_resolve(ok());
    };
    (content.querySelector('button[data-id=c]') || {}).onclick = function () {
        doc.write('Please close this page.')
    };
    (content.querySelector('button.fullscreen-button') || {}).onclick = function () {
        content.classList.toggle('fullscreen');
    };

    (async function () {
        let el = {};
        switch (type) {
            case '《用户协议》更新通知':
                el = content.querySelector('[data-id=p] input');
                break;
            case '《隐私政策》更新通知':
                el = content.querySelector('[data-id=u] input');
                break;
            default: ;
        }
        el.checked = el.$accepted = true;
    })();



    function free() {
        root.remove();
        doc.removeEventListener('keyup', clipKeyboard, { capture: true });
        doc.removeEventListener('keydown', clipKeyboard, { capture: true });

        return 'allowed';
    }
    function ok() {
        rj2011_data['acceptedEULA.u'] = vu;
        rj2011_data['acceptedEULA.p'] = vp;
        rj2011_data.update;
        return free();
    }



    return await ret_promise;
    
}(globalThis, document))
.then(function startStatistics(result) {
    if (result !== 'allowed') return false;
    if (rj2011_data.allowStatistics === false)
        return console.log('[Statistics] Didn\'t load stat script because the user disallowed');
    if (location.origin.includes('127.0.0.1'))
        return console.log('[Statistics] Didn\'t load stat script because the site is running on a local server');

    // Load Statistics script
    fetch('data/main/data/EULA/stat')
    .then(v => v.text())
    .then(async function (data) {
        let fun = new Function(data);
        return fun();
    })
    .then(v => console.log('[Statistics] Statistics script loaded successfully with result', v))
    .catch(function (err) {
        console.warn('[Statistics] Failed to load statistics script:', err);
    })

})

