/* 
    shc0743 rj2011 index.html main.js
*/

dependencies.on('util.js', 'data_init.js', 'wm_helper', 'r-cu-el', 'custom-progressbar')
.then(function () {

(function () {


    let main = document.getElementById('main');
    let cont = null;// = document.querySelector('#main main');
    let page_load_progress = new GenshinImpactLoadingProgressClass();


    {
        let el = document.createElement('div');
        el.classList.add('page-loading-progress');
        page_load_progress.moveTo(el);
        main.append(el);
    }

    setTimeout(function () {
        if (!location.origin.includes('127.0.0.1')) return;
        const el = document.createElement('div');
        el.id = 'tip-in_developing';
        el.innerHTML = '开发中内容，请以实际上线为准';
        addCSS(`#tip-in_developing {`+
            `position: fixed;`+
            `left: 10px;`+
            `bottom: 10px;`+
            `border: 1px solid;`+
            `padding: 5px;`+
            `background: white;`+
            `font-size: small;`+
            `color: grey;`+
            `pointer-events: none;`+
            `z-index: 1001;`+
        `}`, el);
        (document.body || document.documentElement).append(el);
    });


    setTimeout(function () {
        const conErr = console.error;
        console.error = function ConsoleErrorHandler() {
            const retValue = conErr.apply(console, arguments);

            let str = '';
            for (let i = 0; i < arguments.length; ++i) {
                str += arguments[i] + ' ';
            }
            showinfo(`错误: ${str}\r\n(查看控制台以获取更多信息)`, 'error');

            return retValue;
        }
    });

    setTimeout(() => {
        const obj = showTip(`该网站已搬迁至 <code>https://rj2011.pages.dev/</code>。<br><div style="color:gray;text-align:center">点击任意处以前往新网站</div>`, true);
        obj.onclose = () => location.href = 'https://rj2011.pages.dev/';
        obj.el().style.zIndex = 1073741824;
        addCSS(`* { pointer-events: auto !important; }`, obj.el());
    });


    function pageload() {
        let details = document.getElementById('loading_details');
        let loading = document.getElementById('loading_page');
        let prog = new GenshinImpactLoadingProgressClass;
        prog.setRange(0, 100);
        prog.show();


        // load main HTML
        function loadMainHTMLStructure() {
            LoadChunk('data/index.html/chunks/01', 2, 2, function (w, h) {
                prog.value = (function () {
                    if (w == 0 && h == 0) return 5;
                    if (w == 1 && h == 0) return 10;
                    if (w == 0 && h == 1) return 20;
                    if (w == 1 && h == 1) return 25;
                    throw new Error('Cannot understand w and h');
                }());
            })
            .then(function (chunk_data) {
                const div1 = document.createElement('div');
                div1.innerHTML = chunk_data;
                div1.classList.add('container');
                main.append(div1);
                cont = main.querySelector('main');
                prog.value = 30;
            })
            .then(function () {
                if (navigator.userAgent.includes('Mozilla/')) {
                    const el = document.getElementById('SEO')
                    if (el) el.remove()
                }
            })
            .then(function () {
                main.querySelector('#app_menubar_btn').onclick = function () {
                    main.querySelector('#app_menubar').style.display = 'flex';
                }
                main.querySelector('#app_menubar').addEventListener('click', function (ev) {
                    if (ev.target !== this) this.style.display = '';
                }, { capture: true });

                prog.value = 35
            })
            .then(async function () {
                await data_init()
                prog.value = 50

                try {
                    await Initialize();                    
                }
                catch (err) { console.error('Failed to initialize:', err) };

                load_content({
                    callback: function () {
                        prog.value = 75;
                        setTimeout(all_finished, 300);
                    }
                });
            })
            .catch(e => common_error_handler(e));
        };
        loadMainHTMLStructure();



        async function Initialize() {
            if ((rj2011_data.settings || {}).do_not_use_GILP) {
                addCSS(`.GenshinImpactLoadingProgressWrapperClass{display:none!important}`);
            }


            main.querySelector('#plugins-button-container').addEventListener('click', function (ev) {
                this.classList.toggle('open');
            }, { capture: true });
            // main.querySelector('#plugins-button-button').addEventListener('click', function () {
            //     this.parentElement.classList.toggle('open');
            // }, { capture: false });



            (main.querySelector('#webpage-fullscreen-button') || {}).onclick = function () {
                main.querySelectorAll('#webpage-fullscreen-button,main')
                    .forEach(el => el.classList.toggle('expanded'));
            };

        }






        function all_finished(__flag = 0) {
            if (Promise.prototype.isPrototypeOf(__flag)) {
                return __flag.then(() => all_finished());
            }
            if (!__flag) {
                prog.value = prog.getHalfGeoValue();
                return setTimeout(all_finished, getRandom(1000, 2000), 1);
            }
            if (__flag === 1) {
                prog.value = 100;
                return setTimeout(all_finished, getRandom(1000, 1500), 2);
            }

            prog.hide_and_destroy();
            loading.remove();
        }


        function common_error_handler(error) {
            prog.destroy();
            console.error(error);
            let div = document.createElement('div');
            div.style.color = 'red';
            div.innerText = String(error);
            details.prepend(div);
        }
        function divFromText(text = '') {
            let div = document.createElement('div');
            div.innerHTML = text;
            return div;
        }

    };


    {
        const title_base = 'rj2011';
        const sandbox_options = (function () {
            let _ = 'allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-scripts';
            // if (location.hostname === '127.0.0.1')
               _ += ' allow-same-origin';
            return _;
        })();

        function load_content({ event = null, callback = null }) {
            let returnValue = (function () {
                let hash = location.hash;
                hash = hash.substring(1);

                return parseHashData(decodeURIComponent(hash));
            }());
            if (callback) callback(returnValue);
            return returnValue;
        }
        
        //globalThis.
        let adjust_the_height_of_iframe = (function () {
            const ErrorSandboxViolation = Object.create({ toString() { return 'Sandbox Violation' } });
            const ErrorIframeOriginViolation = Object.create({ toString() { return 'Origin Violation' } });
            const max_violation_count = 10;
            let violation_count = 0;
            return async function () {
                if (!cont) return false;
                const el = cont.querySelector('iframe.content');
                if (!el) return false;
                try {
                    // check sandbox
                    if (String(el.sandbox) !== sandbox_options && String(el.sandbox) !== sandbox_options_2) {
                        throw ErrorSandboxViolation;
                    }

                    // if (el.contentWindow.location.origin !== globalThis.location.origin) {
                    //     if (el.contentWindow.location.href !== 'about:blank')
                    //         throw ErrorIframeOriginViolation;
                    // }

                    el.contentWindow.postMessage({
                        'api': 'cors-helper',
                        "subapi": "adjust_the_height_of_iframe"
                    }
                    , location.origin
                    // , globalThis.location.origin
                    );

                
                    // // adjust the height of iframe
                    // let height = el.contentWindow.document.documentElement.offsetHeight;
                    // el.style.height = height + 'px';
                    //
                    // // apply title for document
                    // document.title = el.contentWindow.document.title + ' - ' + title_base;
                
                }
                catch (err) {
                    console.warn('Unable to set height of iframe.\n', (err), String(err));
                    try {
                        if (err === ErrorSandboxViolation) throw err;
                        if (err === ErrorIframeOriginViolation) throw err;
                        el.contentWindow.location.origin
                    }
                    catch (err2) {
                        if (++violation_count > max_violation_count) {
                            console.error(`[FATAL] Access violation for `, violation_count,
                                `\nDocument load is blocked.`);
                            cont.innerHTML = `<h1 style="color:red">致命错误</h1><h3>Access violation</h3><div>请尝试重新加载页面</div>`;
                            return;
                        }
                        
                        console.error('[Security Error] Unable to access iframe, reloading document.\nError', err2, String(err2));
                        load_content({});
                    }
                }
            }
        })();
        setInterval(adjust_the_height_of_iframe, 1000);
        window.addEventListener('resize', function () {
            adjust_the_height_of_iframe();
        }); // (*)
        window.addEventListener('message', function (ev) {
            if (ev.origin !== location.origin) return;
            if (!ev.data) return;
            if (ev.data.api !== 'cors-helper' || ev.data.subapi !== 'adjust_the_height_of_iframe') return;

            if (!cont) return false;
            const el = cont.querySelector('iframe.content');
            if (!el) return false;

            // adjust the height of iframe
            let height = ev.data.data.height;
            el.style.height = height + 'px';

            // apply title for document
            const title = ev.data.data.title + ' - ' + title_base;
            if (title !== document.title) document.title = title;

        });

            
        const content_scripts = {
            'scripts': {
                'data/main/js/cors-helper.js': null,
                'data/js/dependencies.js': null,
                'data/js/util.js': null,
                'data/js/winmenu-helper-custom.min.js': null,
                'data/main/js/data_init.js': null,
                'data/main/js/r-custom-elements.min.js': null,
                'data/main/js/link-navi-helper.js': null,
                '[statcode]': null,
            },
            'styles': {
                'data/main/css/general.css': null,
                'data/main/css/w32ctl.css': null,
            }
        };
        const hash_data_assoc = {
            '/page/': function handler(data) {
                data = data.substring(6);
                return loadContentFromUrl(data); 
            },
            '/article/': function handler(data) {
                data = data.substring(9);
                return loadContentFromUrl(data); 
            },
            '/index/': function handler(data) {
                return loadContentFromUrl('data/main/data/data/index/myindex/');
            },
            '/settings/': function handler(data) {
                return loadContentFromUrl('data/main/data/fn/settings/app.htm');
            },
            '/account/': function handler(data) {
                try {
                    return accountHelper.Handlers.url.handle(data, loadContentFromUrl);
                }
                catch (error) {
                    console.error(error);
                    showinfo('[!] 找不到所需的数据\n[Internel Debug] ' + error, 'error');
                }
                return false
            },
            '/user/': function handler(data) {
                showinfo('暂未实现', 'error', 0);
                return false
            },
            '/contribute/': function handler(data) {
                data = data.substring(12);
                if (data.startsWith('new')) return loadContentFromUrl('data/main/data/fn/contribute/new.html#' + data);
                if (data.startsWith('activity-')) return loadContentFromUrl((function () {
                    const b = new URL(location);
                    b.pathname = '/';
                    const u = new URL(data, b);
                    const m = new URL('data/main/data/fn/contribute/' + u.pathname.substring(1) + '.html', b);
                    return m.pathname.substring(1);
                })());

                return showinfo('请求无效', 'error') && false;
            },
            '/search/': function handler(data) {
                return loadContentFromUrl('data/main/data/fn/search/#' + data);
            },
            '/about/': function handler(data) {
                return loadContentFromUrl('data/main/data/fn/about/about.html#' + data);
            },
            'index\u{FEFF}': function handler(data) {
                return loadDefaultContent();
            },
            'default\u{FEFF}': function default_handler(data) {
                return loadContentFromUrl('data/main/data/data/index/404.html');
            },
        };
        let prevHash = location.hash;
        function parseHashData(data = '') {
            if (data === '' || data === '/') {
                prevHash = location.hash;
                return hash_data_assoc['index\u{FEFF}'](data);
            }
            for (const i in hash_data_assoc) {
                if (data.startsWith(i)) {
                    let $r = hash_data_assoc[i](data);
                    if ($r === false) {
                        // rollback hash
                        history.replaceState({}, '', prevHash);
                        return false;
                    }
                    prevHash = location.hash;
                    return $r;
                }
            }
            return hash_data_assoc['default\u{FEFF}'](data);
        }

        function loadDefaultContent() {
            return loadContentFromUrl('data/main/data/data/index/index.html');
        }
        async function loadContentFromUrl(url = '', type = 'page') {
            return loadContentWithSandbox(url, type);
        }

        async function loadContentScripts(text = '') {
            // const base_value = 20, max_value = page_load_progress.getHalfGeoValue();
            // const item_count = Reflect.ownKeys(content_scripts).length;
            // const step = (max_value - base_value) / item_count;
            const CONTINUE = ({});
            const exec = (function () {
                const divBuffer = document.createElement('div');
                async function exec(k, v, type) {
                    divBuffer.innerHTML = '';
                    let content = content_scripts[k][v];
                    if (!content || !content.url) {
                        try {
                            //
                            /*const resp = await fetch(v);
                            if (!resp.ok) {
                                throw 'HTTP ' + resp.status + ' ' + resp.statusText;
                            }
                            content_scripts[k][v] = new Object();
                            content_scripts[k][v].blob = await resp.blob();
                            content_scripts[k][v].url = URL.createObjectURL(content_scripts[k][v].blob);
                            content = content_scripts[k][v].url;*/
                            
                            let u = new URL(v, location);
                            content_scripts[k][v] = new Object();
                            content_scripts[k][v].url = u.href;
                            content = u.href;
                        }
                        catch (error) {
                            console.warn('Unable to load ', v, 'because', error);
                            return CONTINUE;
                        }
                    } else content = content.url;
                    const t = document.createElement(type);
                    switch (type) {
                        case 'link':
                            t.rel = 'stylesheet';
                            t.href = content;
                            break;
                        
                        case 'script':
                            t.src = content;
                            t.async = false;
                            break;
                    
                        default:
                            t.src = content;
                            break;
                    }
                    divBuffer.append(t);
                    text += divBuffer.innerHTML;
                }
                return exec;
            })();
            for (const script in content_scripts.scripts) {
                await exec('scripts', script, 'script');
            }
            for (const style in content_scripts.styles) {
                await exec('styles', style, 'link');
            }
            // page_load_progress.value = max_value;
            return text;
        }

        async function loadContentScripts_old(text) {
            // const base_value = 20, max_value = page_load_progress.getHalfGeoValue();
            // const item_count = Reflect.ownKeys(content_scripts).length;
            // const step = (max_value - base_value) / item_count;
            const CONTINUE = ({});
            const exec = (function () {
                const divBuffer = document.createElement('div');
                async function exec(k, v, type) {
                    divBuffer.innerHTML = '';
                    if (v === '[statcode]') return;
                    let content = content_scripts[k][v];
                    if (!content || !content.url) {
                        try {
                            const resp = await fetch(v);
                            if (!resp.ok) {
                                throw 'HTTP ' + resp.status + ' ' + resp.statusText;
                            }
                            content_scripts[k][v] = new Object();
                            content_scripts[k][v].blob = await resp.blob();
                            content_scripts[k][v].url = URL.createObjectURL(content_scripts[k][v].blob);
                            content = content_scripts[k][v].url;
                        }
                        catch (error) {
                            console.error('Unable to load', v, 'because', error);
                            return CONTINUE;
                        }
                    } else content = content.url;
                    const t = document.createElement(type);
                    switch (type) {
                        case 'link':
                            t.rel = 'stylesheet';
                            t.href = content;
                            break;
                        
                        case 'script':
                            t.src = content;
                            t.async = false;
                            break;
                    
                        default:
                            t.src = content;
                            break;
                    }
                    // divBuffer.append(t);
                    // text += divBuffer.innerHTML;
                    (text.contentWindow.document.head || text.contentWindow.document.documentElement).append(t);
                }
                return exec;
            })();
            for (const script in content_scripts.scripts) {
                await exec('scripts', script, 'script');
            }
            for (const style in content_scripts.styles) {
                await exec('styles', style, 'link');
            }

            if (rj2011_data.allowStatistics !== false) try {
                if (!location.origin.includes('127.0.0.1') && rj2011_data['acceptedEULA.u']) {
                    // 插入统计代码
                    if (!content_scripts['scripts']['[statcode]']) {
                        const r = await fetch('data/main/data/EULA/stat');
                        if (!r.ok) throw r;
                        content_scripts['scripts']['[statcode]'] = await r.text();
                    }
                    const f = new text.contentWindow.Function(content_scripts['scripts']['[statcode]']);
                    await text.contentWindow.setTimeout(f);
                }
            } catch (Err) { console.warn('[Statistics] Failed to insert stat into content page:', Err) };

            // page_load_progress.value = max_value;
            return text;
        }

        async function attach_text_into_html(text = '', source = '', tags_text = []) {
            let result = [];
            let succeed = false;
            for (const $t of tags_text) {
                const $index = source.indexOf($t);
                if ($index < 0) continue;

                const part1 = source.slice(0, $index + $t.length);
                const part2 = source.slice($index + $t.length);

                result.push(part1);
                result.push(text);
                result.push(part2);

                succeed = true;
                break;
            }
            if (!succeed) return source;
            let blob = new Blob(result);
            if (blob.text) return await blob.text();
            return await (new Response(blob).text());
        }

        let abortctls = [];
        let temp_data_urls = new Map();
        async function loadContentWithSandbox(url) {
            if (!url) throw new TypeError('Invalid paramter');
            if (url.startsWith('http') || url.startsWith('//')) throw new Error('Security Error');

            cont.innerHTML = '';
            page_load_progress.value = 0;
            page_load_progress.show();
            (main.querySelector('.page-loading-progress') || {}).hidden = false;

            for (let i of abortctls) {
                if (i) i.abort('Loading a new page');
            }
            abortctls = [];
            for (let i in temp_data_urls) {
                const d = temp_data_urls.get(i);
                try {
                    URL.revokeObjectURL(d);
                } catch {}
                temp_data_urls.delete(i);
            }

            // mode 
            let mode = 'fetch-download';
        
            let mprog = (main.querySelector('[data-id=data-download-details]') || {});
            let $html_blob = null;
            let intProgId = 0;
            
            {
                mprog.innerHTML = '';
                const el = document.createElement('div');
                el.className = 'loading-progress-text';
                el.dataset.value = 0;
                el.style.left = 0;
                mprog.append(el);
                intProgId = setInterval(() => {
                    if (Number(el.dataset.value) < 99) {
                        el.dataset.value -= -1;
                        el.style.left = `calc(${el.dataset.value}% - 2em)`;
                    }
                }, 50);
            }

            try { $html_blob = await new Promise(function (resolve, reject) {
                let type = '';
                {
                    let abortctl = new AbortController;
                    const prefetch = fetch(url, { signal: abortctl.signal, method: 'head' });
                    prefetch.then(function (resp) {
                        type = resp.headers.get('Content-Type');
                        if (type.includes('text/html')) {
                            mode = 'html-document-load';
                            abortctl.abort();
                            return resolve();
                        }
                        return main();
                    }).catch(reject);
                }
                async function main() {
                    let abortctl = new AbortController;
                    abortctls.push(abortctl);
                    let resp;
                    try {
                        resp = await fetch(url, { signal: abortctl.signal });
                    }
                    catch (err) {
                        return reject(err);
                    }
                    let reader = resp.body.getReader();
                    const contentLength = +resp.headers.get('Content-Length');

                    let receivedLength = 0;
                    let chunks = [];
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        receivedLength += value.length;
                        
                        // todo: update progress
                        // console.log(`Received ${receivedLength} of ${contentLength}`)
                        mprog.innerText = document.title = `${Math.floor((receivedLength/contentLength)*100*1000)/1000}% (${receivedLength} / ${contentLength})`;
                    }
                    mprog.innerText = '';
                    document.title = ' - rj2011';
                    abortctls = [];
                    
                    let blob = new Blob(chunks, { type: type });
                    resolve(blob);
                    return (blob);
                }
            }); }
            catch (error) {
                if (/abort/i.test(String(error))) return null; // aborted
                console.error('[ERROR] Error while loading content:', error);
                mprog.innerHTML = '<div style="color:red"><b>加载失败</b></div><details><summary>错误信息</summary><div data-data></div></details>'
                mprog.querySelector('div[data-data]').innerText = String(error);
                return null;
            }
            let $html_text = null;
            let $dataurl;
            let ifr = document.createElement('iframe');
            if (mode === 'fetch-download') {
                // if ($html_blob.text) $html_text = await $html_blob.text();
                // else $html_text = await (new Response($html_blob).text());
                //
                // {
                //     let u = new URL(url, location);
                //     let _Buffer = document.createElement('script');
                //     _Buffer.innerHTML = `window.__resource_base__='${u}'`;
                //     let texts = `<script>${_Buffer.innerHTML}</script>`;
                //     texts += await loadContentScripts();
                //     // console.log('texts=', texts);
                //     $html_text = await attach_text_into_html(texts, $html_text, ['<head>', '<body>', '<html>']);
                //     // console.log('$html_text=', $html_text)
                // }
                //
                // let $blob = new Blob([$html_text], { type: $html_blob.type });
                $dataurl = URL.createObjectURL($html_blob);
                temp_data_urls.set(ifr, $dataurl);
            }
            

            ifr.sandbox = sandbox_options;
            ifr.title = 'Content';
            ifr.src = (mode === 'fetch-download') ? $dataurl : url;
            async function ifr_onload() {
                if (mode === 'html-document-load') {
                    await loadContentScripts_old(ifr);
                }
                setTimeout(adjust_the_height_of_iframe, 100);
                page_load_progress.value = page_load_progress.getHalfGeoValue();
                setTimeout(() => {
                    page_load_progress.value = 100;
                    if (intProgId) clearInterval(intProgId);
                    mprog.innerHTML = '';
                    ifr.style.display = '';
                    // if (mode === 'fetch-download') {
                    //     URL.revokeObjectURL($dataurl);
                    //     $dataurl = null;
                    // }
                    setTimeout(() => {
                        page_load_progress.hide();
                    }, 200);
                    setTimeout(() => {
                        (main.querySelector('.page-loading-progress') || {}).hidden = true;
                    }, 1000);
                }, getRandom(500, 1000));
            };
            if (mode === 'fetch-download') ifr.onload = ifr_onload;
            ifr.onerror = function (ev) {
                if (mode === 'fetch-download') {
                    URL.revokeObjectURL($dataurl);
                    $dataurl = null;
                }
                if (intProgId) clearInterval(intProgId);
                mprog.innerHTML = '';
                console.error('Failed to load content:', ev);
            }
            ifr.classList.add('content');
            ifr.style.display = 'none';
            cont.append(ifr);
            if (mode === 'html-document-load') {
                let old_doc = ifr.contentDocument;
                let _interval = setInterval(function () {
                    let new_doc = ifr.contentDocument;
                    if (old_doc === new_doc) return;
                    clearInterval(_interval);
                    //ifr.style.display = '';
                    ifr_onload();
                }, 250);
            }
        }

        window.addEventListener('message', function (ev) {
            if (ev.origin !== location.origin) return;
            if (!(ev.data) || (ev.data.type !== 'redirect_hash')) return;
            if (!(ev.data.url)) return;

            if (ev.data.standalone) return window.open(ev.data.url, '_blank');

            if (ev.data.blank) {
                const options = ((blank) => {
                    if (blank === 'blank') return undefined;
                    if (blank === 'newWindow') return `width=${window.innerWidth},height=${window.innerHeight},left=${window.screenLeft},top=${window.screenTop}`;
                })(ev.data.blank);

                const url = new URL(location);
                url.hash = '#/' + ev.data.url;
                return window.open(url.href, '_blank', options);
            }

            if (String(ev.data.url).startsWith('#')) return location.hash = ev.data.url;
            
            location.hash = '#/' + ev.data.url;
        })


        function hashchange(ev) {
            load_content({ event: ev });
        }

        globalThis.pagereload = function () {
            load_content({});
        }

        function DCL() {
            setTimeout(pageload);
            window.addEventListener('hashchange', hashchange);
            // setTimeout(hashchange);
        }
        if (document.readyState == 'loading') {
            window.addEventListener('DOMContentLoaded', DCL, { once: true });
        } else {
            setTimeout(DCL);
        }

    }


    // storageAPI
    {
        window.addEventListener('message', function (ev) {
            if (ev.origin !== location.origin) return;
            if (!ev.data) return;
            if (ev.data.api !== 'cors-helper' || !String(ev.data.subapi).startsWith('storageAPI') || ev.data.callback) return;

            switch (ev.data.subapi) {
                case 'storageAPI.get':
                    {
                        let obj = JSON.parse(JSON.stringify(rj2011_data));
                        ev.source.postMessage({
                            api: ev.data.api,
                            subapi: ev.data.subapi,
                            callback: true,
                            result: obj,
                        }, ev.source.origin);
                    }
                    break;
                case 'storageAPI.set':
                    try {
                        rj2011_data = ev.data.data;
                        rj2011_data.update;
                        ev.source.postMessage({
                            api: ev.data.api,
                            subapi: ev.data.subapi,
                            callback: true,
                            id: ev.data.id,
                            result: ev.data.data,
                        }, ev.source.origin);
                    }
                    catch (err) {
                        ev.source.postMessage({
                            api: ev.data.api,
                            subapi: ev.data.subapi,
                            callback: true,
                            id: ev.data.id,
                            error: true,
                            result: err,
                        }, ev.source.origin);
                    }
                    break;
                case 'storageAPI.setItem':
                    try {
                        rj2011_data[ev.data.data.key] = ev.data.data.value;
                        rj2011_data.update;
                        ev.source.postMessage({
                            api: ev.data.api,
                            subapi: ev.data.subapi,
                            callback: true,
                            id: ev.data.id,
                            result: ev.data.data,
                        }, ev.source.origin);
                    }
                    catch (err) {
                        ev.source.postMessage({
                            api: ev.data.api,
                            subapi: ev.data.subapi,
                            callback: true,
                            id: ev.data.id,
                            error: true,
                            result: err,
                        }, ev.source.origin);
                    }
                    break;
            
                default:
                    ev.source.postMessage({
                        api: ev.data.api,
                        subapi: ev.data.subapi,
                        callback: true,
                        result: new Error('API not found'),
                        error: true,
                    }, ev.source.origin);
            }
        });

    }




    // generic api

    const apis_allowed = {
        'showinfo': globalThis.showinfo,
        'requestInput': globalThis.requestInput,
        'reload_content': globalThis.pagereload,
        'history.go': globalThis.history.go.bind(globalThis.history),
        'requestLogin': globalThis.requestLogin,
        'reLoad': globalThis.location.reload.bind(globalThis.location),
    }

    window.addEventListener('message', function (ev) {
        if (ev.origin !== location.origin) return;
        if (!ev.data) return;
        if (!(apis_allowed[ev.data.api])) return;
        let ret;
        try {
            ret = apis_allowed[ev.data.api].apply(window, ev.data.args || []);
        }
        catch (error) {
            return ev.source.postMessage({
                'type': 'api_callback',
                'result': null,
                'error': true,
                'why_result_is_null': String(error),
                'callback_id': ev.data.id
            }, ev.source.origin);
        }
        if (Promise.prototype.isPrototypeOf(ret)) {
            ret.then(function (data) {
                ev.source.postMessage({
                    'type': 'api_callback',
                    'async': 'true',
                    'result': data,
                    'callback_id': ev.data.id
                }, ev.source.origin);
            })
            .catch(function (err) {
                ev.source.postMessage({
                    'type': 'api_callback',
                    'async': true,
                    'error': true,
                    'result': err,
                    'callback_id': ev.data.id
                }, ev.source.origin);
            })
            .catch(function (err) {
                console.error('Failed to handle message', ev, ':', err);
                ev.source.postMessage({
                    'type': 'api_callback',
                    'async': true,
                    'error': true,
                    'error_type': 'unknown',
                    'result': null,
                    'callback_id': ev.data.id
                }, ev.source.origin);
            })
            return;
        }

        try {
            ev.source.postMessage({
                'type': 'api_callback',
                'result': ret,
                'callback_id': ev.data.id
            }, ev.source.origin);
        }
        catch (error) {
            if (ev.source)
            ev.source.postMessage({
                'type': 'api_callback',
                'result': null,
                'why_result_is_null': String(error),
                'callback_id': ev.data.id
            }, ev.source.origin);
        }
    });




    // print
    window.addEventListener('keydown', function (ev) {
        if (!(ev.key.toUpperCase() === 'P' && ev.ctrlKey)) return;

        try {
            callPrint();
            ev.preventDefault();
            return false;
        }
        catch (err) {
            console.error('[ERROR] Failed to call print in sub document:', err, '\nCalling native API instead');
        }


    });
    globalThis.callPrint = function () {
        const w = main.querySelector('main iframe').contentWindow;
        return w.setTimeout(async function () { return new Promise(function (resolve) { resolve(w.print()) }) });
    }





}());

})

