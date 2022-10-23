(function () {

    let data;
    Object.defineProperty(window, 'rj2011_data', {
        get() { return data },
        set(value) { throw new TypeError(`Unable to change rj2011_data directly (trying to set (new value: ${value}))`) },
        enumerable: true,
        configurable: true,
    });

    try {
        (data = JSON.parse(localStorage.getItem('rj2011_data')))
        if (!data) throw new Error('data not found');
    }
    catch (err) {
        console.warn(`rj2011_data not found or cannot be parsed, recreate it\n`, err);
        data = {};
        store_data();
    }






    function store_data() {
        localStorage.setItem('rj2011_data', JSON.stringify(data));
    }


}())
