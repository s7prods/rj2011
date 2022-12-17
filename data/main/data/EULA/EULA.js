(async function (global, doc) {
    await dependencies.on('data_init.js', 'util.js');

    const root = doc.createElement('div');
    const backdrop = doc.createElement('div');
    const content = doc.createElement('div');
    backdrop.classList.add('EULA_viewer-da72eae4-backdrop');
    content.classList.add('EULA_viewer-da72eae4-content');
    addCSS(`
    * {
        user-select: none;
    }
    .EULA_viewer-da72eae4-backdrop, .EULA_viewer-da72eae4-content {
        position: fixed;
        z-index: 1073741823;
    }
    .EULA_viewer-da72eae4-backdrop {
        left: 0; right: 0; top: 0; bottom: 0;
        cursor: not-allowed;
        background: black; opacity: 0.5;
    }
    .EULA_viewer-da72eae4-content {
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
    @media screen and (max-width: 500px) {
        .EULA_viewer-da72eae4-content {
            min-width: calc(100% - 25px);
        }
    }
    .EULA_viewer-da72eae4-content.fullscreen {
        left: 0; right: 0; top: 0; bottom: 0;
        transform: revert !important;
    }
    .EULA_viewer-da72eae4-content .content {
        border: 1px solid #ccc;
        padding: 10px;
        user-select: text;
    }
    .EULA_viewer-da72eae4-content .content * {
        user-select: text;
    }
    .EULA_viewer-da72eae4-content .content:not(.open) {
        display: none;
    }
    .EULA_viewer-da72eae4-content .content.failed::before {
        content: "加载失败: " attr(data-error);
        color: red;
    }
    .EULA_viewer-da72eae4-content .fullscreen-button {
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
    .EULA_viewer-da72eae4-content.fullscreen .fullscreen-button {
        background-image: url(data/index.html/fullscreen-shrink.svg);
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
        return content.innerHTML = `<h1 style="color:red">数据加载失败，请尝试刷新页面。</h1>`;
    }

    if (rj2011_data['acceptedEULA.u'] === vu && rj2011_data['acceptedEULA.p'] === vp) return free();

    backdrop.style.display = content.style.display = '';

    let type = '《用户协议》及《隐私政策》';
    if (rj2011_data['acceptedEULA.u'] && rj2011_data['acceptedEULA.p'] ) type += '更新通知';
    if (rj2011_data['acceptedEULA.u'] === vu) type = '《隐私政策》更新通知';
    if (rj2011_data['acceptedEULA.p'] === vp) type = '《用户协议》更新通知';


    let $content_html;
    try {
        $content_html = await fetch('data/main/data/EULA/page.html');
        if (!$content_html.ok) throw null;
        $content_html = await $content_html.text()
    } catch { return content.innerHTML = `<h1 style="color:red">数据加载失败，请尝试刷新页面。</h1>`; }
    
    content.innerHTML = $content_html;
    (content.querySelector('.title') || {}).innerText = type;

    content.addEventListener('input', function (ev) {
        if (ev.target.tagName.toLowerCase() !== 'input') return;
        let el = (ev.target.parentElement.parentElement.querySelector('.content') || {});
        if (el.innerHTML === '' && !ev.target.$accepted) {
            ev.preventDefault();
            ev.target.checked = false;
            showinfo('需要先查看内容。', 'error');
        } else {
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
            return content.classList.toggle('open') || true;
        }
        content.classList.add('open');
        content.classList.remove('failed');
        content.innerHTML = '正在加载...';
        getEula(el.getAttribute('data-id'))
        .then(function (text) {
            content.innerHTML = text;
        })
        .catch(function (err) {
            content.innerHTML = '';
            content.classList.add('failed');
            content.setAttribute('data-error', err);
        });
    }, { capture: true });
    (content.querySelector('button[data-id=o]') || {}).onclick = function () {
        let _ = true;
        content.querySelectorAll('input[type=checkbox]').forEach(el => {
            if (!el.checked) _ = false;
        });
        if (!_) return showinfo('非法请求', 'error');
        ok();
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
        doc.removeEventListener('keydown', clipKeyboard, { capture: true });
    }
    function ok() {
        rj2011_data['acceptedEULA.u'] = vu;
        rj2011_data['acceptedEULA.p'] = vp;
        rj2011_data.update;
        free();
    }
    
}(globalThis, document));