/* 
    shc0743 rj2011 index.html main.js
*/

(function () {

    (function pageload() {
        let main = document.getElementById('main');
        let details = document.getElementById('loading_details');
        let prog = new GenshinImpactLoadingProgressClass;
        prog.setRange(0, 100);
        prog.show();


        // load main HTML
        function loadMainHTML() {
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
                load_content(function () {
                    prog.value = 35;
                    setTimeout(all_finished, 300);
                });
            })
            .catch(e => common_error_handler(e));
        };



        loadMainHTML();




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

            prog.hide();
            details.parentElement.remove();
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

    })();


    function load_content(callback = null) {
        let returnValue = (function () {
            let hash = location.hash;
            hash = hash.substring(2);
            if (hash.length < 1) {
                return loadDefaultContent();
            }
            
            return loadContentFromUrl(decodeURIComponent(hash));
        }());
        if (callback) callback(returnValue);
        return returnValue;
    }
    async function loadDefaultContent() {
        return await loadContentFromUrl('data/main/data/data/index/index.html');
    }
    async function loadContentFromUrl(url = '') {
        let f = await fetch(url);
        if (!f.ok) throw f.status;
        let t = await f.text();

        let el = document.querySelector('#main main');
        el.innerHTML = '';
        let div = document.createElement('div');
        div.innerHTML = t;
        el.append(div);
    }


    function hashchange() {
        load_content();
    }

    window.addEventListener('load', function () {
        window.addEventListener('hashchange', hashchange);
    }, { once: true });



}());

