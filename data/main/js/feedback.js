dependencies.on('util.js').then(function () {
    
    const root = document.createElement('div');
    root.id = ('ScFeedbackUI');
    root.classList.add('modal-center-dialog-container');
    addCSS(``, root);
    (document.body || document.documentElement).append(root);

    const el = document.createElement('div');
    el.classList.add('modal-center-dialog');
    root.append(el);

    el.innerHTML = `
    <h1 style="text-align: center;">发现问题？</h1>

    <div>
        <fieldset>
            <legend>我发现了一个功能性的 Bug ...</legend>
            <button data-t=bug>报告这个 Bug</button>
        </fieldset>
        <br>
        <fieldset>
            <legend>我发现了这篇文章的一处错误...</legend>
            <button data-t=art>报告这处错误</button>
        </fieldset>
        <br>
        <fieldset>
            <legend>我希望增加一些功能...</legend>
            <button data-t=fun>请求增加功能</button>
        </fieldset>
    </div>

    <br>
    <a href="javascript:" data-t=close>关闭</a>
    `;


    globalThis.openFeedbackUI = function () {
        root.classList.add('open')
    };



    el.querySelector('[data-t=close]').onclick = function () {
        root.classList.remove('open')
    }


    el.querySelector('[data-t=bug]').onclick = function () {
        const u = new URL('https://github.com/s7prods/rj2011/issues/new?assignees=&labels=bug%2Ctriage&template=BugReport.yml&title=%5BBug%5D%3A+');
        u.searchParams.append('user_agent', navigator.userAgent);
        u.searchParams.append('url', location.href);
        window.open(u, '_blank');
        root.classList.remove('open')
    }

    el.querySelector('[data-t=art]').onclick = function () {
        const u = new URL('https://github.com/s7prods/rj2011/issues/new?assignees=&labels=article%2Cwrong&template=WrongArticle.yml&title=%5B%E6%96%87%E7%AB%A0%E7%BA%A0%E9%94%99%5D%3A+');
        try {
            const ifr = document.querySelector('#main main iframe');
            u.searchParams.append('url', ifr.contentWindow.location.href);
        }
        catch {
            u.searchParams.append('url', location.href);
        }
        window.open(u, '_blank');
        root.classList.remove('open')
    }

    el.querySelector('[data-t=fun]').onclick = function () {
        const u = new URL('https://github.com/s7prods/rj2011/issues/new?assignees=&labels=&template=FuncSuggest.yml&title=%5B%E5%8A%9F%E8%83%BD%E5%BB%BA%E8%AE%AE%5D%3A+');
        window.open(u, '_blank');
        root.classList.remove('open')
    }

    




});