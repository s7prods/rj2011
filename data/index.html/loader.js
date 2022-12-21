(function () {

    let details = document.getElementById('loading_details');

    reportProgress('Loading...');

    let loaderData = null;
    let currentScriptLoadProgress = 0;

    let loader = 'data/index.html/loader.min.json';
    if (location.origin.includes('127.0.0.1')) loader = 'data/index.html/loader.json';

    fetch(loader)
    .then(v => v.json())
    .then(function (data) {
        loaderData = data;
        if (data.styles) {
            // load styles
            for (let i of data.styles) {
                let el = document.createElement('link');
                el.rel = 'stylesheet';
                el.href = i.url;
                el.onload = loadedEvent_async;
                el.onerror = failedEvent_async;
                (document.head || document.documentElement).append(el);
            }
        }
        if (data.scripts) {
            // load scripts
            load_next_script();
        }
    })
    .catch(err => {
        reportProgress(divFromText(
        `<div style="color: red; font-weight: bold;">数据加载失败</div>`+
        `<details>`+
            `<summary>详细信息</summary>`+
            `<div>${String(err)}</div>`+
        `</details>`));
    });



    function load_next_script() {
        while (1) {
            let pFirst = loaderData.scripts[currentScriptLoadProgress++];
            if (!pFirst) break;
            if (pFirst.condition) {
                try {
                    if (!eval(pFirst.condition)) continue;
                }
                catch (a) {
                    console.warn('Error: error in condition', pFirst.condition, ':', a);
                    continue;
                }
            }
            let el = document.createElement('script');
            el.src = pFirst.url;
            el.required = pFirst.required;
            el.onload = pFirst.async ? loadedEvent_async : loadedEvent_syncscript;
            el.onerror = pFirst.async ? failedEvent_async : failedEvent_syncscript;
            if (pFirst.onload) try {
                el._$onLoadEvent = new Function(pFirst.onload);
            } catch (error) {
                console.warn('Failed to construct onload event handler', '\nData:', pFirst, '\nError:', error);
            }
            (document.head || document.documentElement).append(el);
            if (!pFirst.async) break;
        }
    }
    function loadedEvent_syncscript(ev) {
        reportProgress(`[${datestr()}] 已加载资源 ${ev.target.src || ev.target.href || ''}`);
        load_next_script();
        if (ev.target._$onLoadEvent) try { ev.target._$onLoadEvent(ev.target); } catch (error) {
            console.warn('Failed to execute onload event handler', '\nFunction:', ev.target._$onLoadEvent, '\nError:', error);
        }
    }
    function loadedEvent_async(ev) {
        reportProgress(`[${datestr()}] 已加载资源 ${ev.target.src || ev.target.href || ''}`);
        if (ev.target._$onLoadEvent) try { ev.target._$onLoadEvent(ev.target); } catch (error) {
            console.warn('Failed to execute onload event handler', '\nFunction:', ev.target._$onLoadEvent, '\nError:', error);
        }
    }
    function failedEvent_syncscript(ev) {
        reportProgress(divFromText(`<span style="color: red">[${datestr()}]${ev.target.required?' [ERROR]':''} 资源加载失败: ${ev.target.src || ''}</span>`));
        if (!ev.target.required) load_next_script();
    }
    function failedEvent_async(ev) {
        reportProgress(divFromText(`<span style="color: red">[${datestr()}]${ev.target.required?' [ERROR]':''} 资源加载失败: ${ev.target.src || ev.target.href || ''}</span>`));
    }




    function datestr(date = new Date()) {
        return `${date.getFullYear()}-` +
            `${date.getMonth()+1}-${date.getDate()} `+
            `${date.getHours()}:${date.getMinutes()}:` +
            `${date.getSeconds()}.${date.getMilliseconds()}`;
    }

    function reportProgress(text = '') {
        if (HTMLElement.prototype.isPrototypeOf(text)) {
            details.prepend(text);
            return text;
        }
        let div = document.createElement('div');
        div.append(document.createTextNode(text));
        details.prepend(div);
        return div;
    }

    function divFromText(text='') {
        let div = document.createElement('div');
        div.innerHTML = text;
        return div;
    }

}())
