(async function () {

    let data = {};

    try {
        if (window.__resource_base__) {
            data = await storageAPI.getStorage();
        } else
        (data = JSON.parse(localStorage.getItem('rj2011_data')))
        if (!data) throw new Error('data not found');
    }
    catch (err) {
        console.warn(`rj2011_data not found or cannot be parsed, recreate it\n`, err);
        data = {};
        store_data();
    }

    let _rj2011_data = new Proxy(data, {
        get(target, p, receiver) {
            if (p === 'update') {
                store_data();
                return true;
            }
            return Reflect.get(target, p, receiver);
        },
        set(target, p, newValue, receiver) {
            store_data();
            return Reflect.set(target, p, newValue, receiver); // (2)
        }
    });
    Object.defineProperty(globalThis, 'rj2011_data', {
        get() { return _rj2011_data },
        set(value) { store_data(value); data = value; return true },
        enumerable: true,
        configurable: true,
    });



    function store_data(val = data) {
        if (globalThis.__resource_base__) {
            return storageAPI.setStorage(val);
        }
        localStorage.setItem('rj2011_data', JSON.stringify(val));
    }



    if (window.dependencies) dependencies.done('data_init.js');

}())
