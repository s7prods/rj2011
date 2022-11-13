/* 
    shc0743 rj2011 index.html main.js
*/

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
                main.append(divFromText(chunk_data));
                cont = document.querySelector('#main main');
                prog.value = 30;
            })
            .then(function () {
                if (navigator.userAgent.includes('Mozilla/')) {
                    const el = document.getElementById('SEO')
                    if (el) el.remove()
                }
            })
            .then(async function () {
                await LoadUserInfo()
                prog.value = 35
                await InitUserComponents()
                prog.value = 40

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
        const sandbox_options = 'allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';
        const ErrorSandboxViolation = Object.create({ toString() { return 'Sandbox Violation' } });

        function load_content({ event = null, callback = null }) {
            let returnValue = (function () {
                let hash = location.hash;
                hash = hash.substring(1);

                return parseHashData(decodeURIComponent(hash));
            }());
            if (callback) callback(returnValue);
            return returnValue;
        }

        let ifrdoccheck = null;
        
        //globalThis.
        let adjust_the_height_of_iframe = function () {
            if (!cont) return false;
            const el = cont.querySelector('iframe.content');
            if (!el) return false;
            try {
                // check sandbox
                if (String(el.sandbox) !== sandbox_options) {
                    throw ErrorSandboxViolation;
                }

                // adjust the height of iframe
                let height = el.contentWindow.document.documentElement.offsetHeight;
                el.style.height = height + 'px';

                // apply title for document
                document.title = el.contentWindow.document.title + ' - ' + title_base;
            }
            catch (err) {
                console.warn('Unable to set height of iframe.\n', (err));
                try {
                    if (err === ErrorSandboxViolation) throw err;
                    el.contentWindow.location.origin
                }
                catch (err2) {
                    console.error('[Security Error] Unable to access iframe, reloading document.\nError', err2);
                    loadDefaultContent();
                }
            }
        }
        setInterval(adjust_the_height_of_iframe, 1000);

            
        const content_scripts = {
            'scripts': {
                'data/js/util.js': null,
                'data/js/winmenu-helper.js': null,
                'data/main/js/data_init.js': null,
                'data/main/js/r-custom-elements.js': null,
                'data/main/js/link-navi-helper.js': null,
            },
            'styles': {
                'data/main/css/general.css': null,
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
                alert('暂未实现')
            },
            '/account/': function handler(data) {
                alert('暂未实现')
            },
            '/user/': function handler(data) {
                alert('暂未实现')
            },
            '/search/': function handler(data) {
                return loadContentFromUrl('data/main/data/data/search/#' + data);
            },
            '/about/': function handler(data) {
                return loadContentFromUrl('data/main/data/data/about/about.html#' + data);
            },
            'index\u{FEFF}': function handler(data) {
                return loadDefaultContent();
            },
            'default\u{FEFF}': function default_handler(data) {
                return loadContentFromUrl('data/main/data/data/index/404.html');
            },
        };
        function parseHashData(data = '') {
            if (data === '' || data === '/') return hash_data_assoc['index\u{FEFF}'](data);
            for (const i in hash_data_assoc) {
                if (data.startsWith(i)) {
                    return hash_data_assoc[i](data);
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

        async function loadContentScripts(ifr) {
            const base_value = 20, max_value = page_load_progress.getHalfGeoValue();
            const item_count = Reflect.ownKeys(content_scripts).length;
            const step = (max_value - base_value) / item_count;
            const CONTINUE = ({});
            async function exec(k, v, type) {
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
                        console.warn('Unable to load ', script, 'because', error);
                        return CONTINUE;
                    }
                } else content = content.url;
                const t = ifr.contentWindow.document.createElement(type);
                switch (type) {
                    case 'link':
                        t.rel = 'stylesheet';
                        t.href = content;
                        break;
                
                    default:
                        t.src = content;
                        break;
                }
                t.src = content;
                (ifr.contentWindow.document.head || ifr.contentWindow.document.documentElement).append(t);
            }
            for (const script in content_scripts.scripts) {
                await exec('scripts', script, 'script');
            }
            for (const style in content_scripts.styles) {
                await exec('styles', style, 'link');
            }
            page_load_progress.value = max_value;
        }

        let __isfirstcall_loadContentWithSandbox = true;
        async function loadContentWithSandbox(url, type = 'page') {
            if (!url) throw new TypeError('Invalid paramter');
            if (url.startsWith('http') || url.startsWith('//')) throw new Error('Security Error');

            if (__isfirstcall_loadContentWithSandbox) {
                __isfirstcall_loadContentWithSandbox = false;

                page_load_progress.setSvgSize(32);
            }
            cont.innerHTML = '';
            page_load_progress.value = 0;
            page_load_progress.show();
            let ifr = document.createElement('iframe');
            ifr.sandbox = sandbox_options;
            ifr.src = url;
            function ifr_onload(ifr) {
                (async function (ifr) {
                    page_load_progress.show();
                    await loadContentScripts(ifr);
                    setTimeout(adjust_the_height_of_iframe, 100);
                    page_load_progress.value = page_load_progress.getHalfGeoValue();
                    setTimeout(() => {
                        page_load_progress.value = 100;
                        ifr.style.display = '';
                        setTimeout(() => {
                            page_load_progress.hide();
                        }, 200);
                    }, getRandom(500, 1000));
                })(ifr);
            };
            ifr.classList.add('content');
            ifr.style.display = 'none';
            cont.append(ifr);
            let old_doc = ifr.contentDocument;
            let _interval = setInterval(function () {
                let new_doc = ifr.contentDocument;
                if (old_doc === new_doc) return;
                clearInterval(_interval);
                //ifr.style.display = '';
                ifr_onload(ifr);
            }, 250);
        }

        window.addEventListener('message', function (ev) {
            if (ev.origin !== location.origin) return;
            if (!(ev.data) || (ev.data.type !== 'redirect_hash')) return;
            if (!(ev.data.url)) return;
            
            switch (ev.data.url) {
                case '$index':
                    location.hash = '#/index/';
                    break;
            
                default:
                    location.hash = '#/' + ev.data.url;
                    break;
            }
        })


        function hashchange(ev) {
            load_content({ event: ev });
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



}());

