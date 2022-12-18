(function () {
    
    const interval_0001 = setInterval(function () {
        if (!window.rj2011_data) return;
        clearInterval(interval_0001);
        const el = document.querySelector('#allowStatistics') || {};
        el.checked = (rj2011_data.allowStatistics === false ? false : true);
        el.disabled = false;
        el.oninput = function () {
            rj2011_data.allowStatistics = el.checked;
            parent.postMessage({
                api: 'showinfo', args: ['您已成功更新您的统计首选项。']
            }, location.origin);
        }
    }, 500);


})();