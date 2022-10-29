(function (window) {

    function getUrlValue(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substring(1).match(reg);
        if (r != null) {
            try {
                return decodeURIComponent(r[2]);
            } catch (e) {
                return null;
            }
        }
        return null;
    }


    let url = getUrlValue('url');
    if (!url) return document.write('Invalid paramter');

    function resize_interval() {
        try {
            parent.adjust_the_height_of_iframe(document.documentElement.offsetHeight)
        } catch (error) {
            void(error)
        }
    }
    setInterval(resize_interval, 1000);
    setTimeout(resize_interval);


    fetch(url)
    .then(function (v) {
        if (!v.ok) throw new Error('Failed to load resource: HTTP ' + v.status + " " + v.statusText);
        return (v => v.text())(v);
    })
    .then(function (data) {
        document.write(data);
    })
    .catch(function (error) {
        let el = document.createElement('r-error-box');
        el.innerText = error;
        (document.body || document.documentElement).append(el);
    });


})(globalThis);

