(function (window) {


    const fn = {};
    fn._default = function (data) {
        return `Invalid function name ${data.subapi}`;
    };

    window.addEventListener('message', function (ev) {
        if (ev.origin !== location.origin) return;
        if (!ev.data || ev.data.api !== 'cors-helper') return;
        if (!fn[ev.data.subapi]) return;

        ev.source.postMessage({
            api: 'cors-helper',
            subapi: ev.data.subapi,
            type: 'callback',
            data: (fn[ev.data.subapi] || fn._default)(ev.data)
        }, location.origin);
    });



    fn.adjust_the_height_of_iframe = function () {
        return {
            height: window.document.documentElement.offsetHeight,
            title: window.document.title,
        }
    };




    do {
        if (globalThis.storageAPI) break;
        (globalThis.storageAPI = {});
        let _instance = {};
        let _last_id = 1;

        const registeredEventCallback = new Map();
        registeredEventCallback.add = function (data) {
            registeredEventCallback.set(registeredEventCallback.size, data);
        }
        window.addEventListener('message', function (ev) {
            if (!(ev.data && ev.data.api === 'cors-helper' && String(ev.data.subapi).startsWith('storageAPI'))) return;
            switch (ev.data.subapi) {
                case 'storageAPI.get':
                    if (!ev.data.error) _instance = ev.data.result;
                    for (let i = registeredEventCallback.size; i;) {
                        --i;

                        if (registeredEventCallback.get(i).type !== 'get') continue;
                        registeredEventCallback.get(i)[ev.data.error ? 'reject' : 'resolve'](ev.data.result);
                        registeredEventCallback.delete(i);
                    }
                    break;
                case 'storageAPI.set':
                    if (!ev.data.error) _instance = ev.data.result;
                    for (let i = registeredEventCallback.size; i;) {
                        --i;

                        if (registeredEventCallback.get(i).type !== 'set') continue;
                        if (registeredEventCallback.get(i).id !== ev.data.id) continue;
                        registeredEventCallback.get(i)[ev.data.error ? 'reject' : 'resolve'](ev.data.result);
                        registeredEventCallback.delete(i);
                    }
                    break;
                case 'storageAPI.setItem':
                    // if (!ev.data.error) _instance = ev.data.result;
                    for (let i = registeredEventCallback.size; i;) {
                        --i;

                        if (registeredEventCallback.get(i).type !== 'setItem') continue;
                        if (registeredEventCallback.get(i).id !== ev.data.id) continue;
                        registeredEventCallback.get(i)[ev.data.error ? 'reject' : 'resolve'](ev.data.result);
                        registeredEventCallback.delete(i);
                    }
                    break;
            
                default: ;
            }
        });

        globalThis.storageAPI.getStorage = function () {
            return new Promise(function (resolve, reject) {
                registeredEventCallback.add({
                    type: 'get',
                    resolve: resolve,
                    reject: reject,
                });
                parent.postMessage({
                    api: 'cors-helper',
                    subapi: 'storageAPI.get',
                    
                }, location.origin);
            });
        };
        globalThis.storageAPI.setStorage = function (newData) {
            return new Promise(function (resolve, reject) {
                const id = _last_id++;
                registeredEventCallback.add({
                    type: 'set',
                    id: id,
                    resolve: resolve,
                    reject: reject,
                });
                parent.postMessage({
                    api: 'cors-helper',
                    subapi: 'storageAPI.set',
                    id: id,
                    data: newData,
                }, location.origin);
            });
        };
        globalThis.storageAPI.setItem = function (k, v) {
            return new Promise(function (resolve, reject) {
                const id = _last_id++;
                registeredEventCallback.add({
                    type: 'setItem',
                    id: id,
                    resolve: resolve,
                    reject: reject,
                });
                parent.postMessage({
                    api: 'cors-helper',
                    subapi: 'storageAPI.setItem',
                    id: id,
                    data: {
                        key: k,
                        value: v,
                    }
                }, location.origin);
            });
        };

        Object.defineProperty(globalThis.storageAPI, 'instance', {
            get() { return _instance },
            set(v) { return globalThis.storageAPI.setStorage(v) },
            enumerable: false,
            configurable: false,
        });

        Object.freeze(globalThis.storageAPI);
    } while (0);





    let _resPageBase = globalThis.__resource_base__ || '';
    let availableResourceTags = {'script':1,'link':1};

    function intUpdateResourcePath(resource) {
        if (resource._pathUpdated) return;
        if (!(resource.tagName.toLowerCase() in availableResourceTags)) return;
        
        let k = 'src';
        if (resource.tagName.toLowerCase() === 'link') k = 'href';
        let v = resource.getAttribute(k) || '';
        if (v.startsWith('/') || v.startsWith('http')) return;

        let newChild = resource.cloneNode(true);
        newChild[k] = _resPageBase + '/../' + v;
        newChild.setAttribute(k, newChild[k]);
        newChild._pathUpdated = true;
        resource.replaceWith(newChild);
    }
    function UpdateResourcePath() {
        document.querySelectorAll('[src],[href]:not(a)').forEach(el => {
            intUpdateResourcePath(el);
        })
    }

    // disable this feature
    if (0)
    window.addEventListener('DOMContentLoaded', function () {
        UpdateResourcePath();
        function callback(n) {
            for (let i of n) {
                intUpdateResourcePath(i.target);
            }
        }
        const observe_config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href'],
            characterData: false,
            attributeOldValue: false
        };
        let observer_head = new MutationObserver(callback);
        observer_head.observe(document.head, observe_config);
        let observer_body = new MutationObserver(callback);
        observer_body.observe(document.body, observe_config);
    }, { once: true });


})(typeof globalThis !== 'undefined' ? globalThis : window);
