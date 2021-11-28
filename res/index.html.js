(function(){

    if (!(Data_2011_.CurrentUser && Data_2011_.CurrentUser.isLogin)) {
        location.href = './data/auth_svc/ui/#/trust_check/'
    }

    function onhashchange(event){
        void(event); // Ignore warning
        var hash = location.hash;
        // console.log(hash);
        /* It looks like there:
            #/indexes/
            #/settings/
            #/account/login/
            #/indexes/
            #/random/
            #/search/
            #/exit/0
            #/about/website
        */
        if(hash.length < 3) return;
        hash = hash.substr(1);

        if (hash.substr(0, 6) == '/exit/') return window.close() || AbortAndDisablePage();
        if (hash.substr(0, 6) == '/view/' || hash.substr(0, 14) == '/view_noframe/') {
            var _url = '';
            if (hash.substr(0, 6) == '/view/') {
                _url = hash.substr(7);
                document.querySelector('nav').hidden = false;
                document.querySelector('footer').hidden = false;
            }
            else {
                _url = hash.substr(15);
                document.querySelector('nav').hidden = true;
                document.querySelector('footer').hidden = true;
                hash = '/view/' + (hash.substr(14))
            }
            
            main.querySelector('#main_status_bar [data-status_loading]').hidden = false;
            main_status_bar.querySelector('[data-status_loading_text]').innerHTML =
                '正在加载数据,请稍候...';
            
            let el_b = document.createElement('div');
            el_b.setAttribute('style', 'position:absolute;width:100%;height:100%;ba' +
                'ckground:rgba(255,255,255,0.5);left:0;top:0;z-index:12;cursor:wait;');
            passage_show.appendChild(el_b);
            fetch('./data/view/' + hash.substr(6)).then(v => { return v.text() },
                e => { main_status_bar.querySelector('[data-status_loading_text]').
                    innerHTML = '<img src="res/error.png" alt=Error width=21' +
                    ' height=21 />数据加载失败,请重试';el_b.remove()
            }).then(function (v) {
                if (!v) {
                    main_status_bar.querySelector('[data-status_loading_text]').
                    innerHTML = '<img src="res/error.png" alt=Error width=21' +
                        ' height=21 />数据加载失败,请重试'; return false;
                }
                el_b.remove();
                passage_show.innerHTML = v;
                main.querySelector('#main_status_bar [data-status_loading]').hidden = true;
            });
            return;
        }
        if (hash == '/indexes/') {
            return location.href = '#/view/../site_index/sindex.html';
        }
        if (hash.substr(0, 9) == '/account/') {
            return location.href = 'data/auth_svc/ui/#' + hash;
        }
    }
    window.addEventListener('hashchange', onhashchange);
    onhashchange(null);

    if (location.hash == '' || location.hash == '#' || location.hash == '#/')
    fetch("./res/default.htm")
    .then(v=>{return v.text()},function(e){
        UserReportFetchError("Fetch 请求失败: " + e, true);
    })
    .then(function(v){
        passage_show.innerHTML = v;
        // var e = passage_show.querySelectorAll('a');
    })

    window._tmp1 = () => {
        delete _tmp1;
        document.querySelector('nav span a[title="My"]').innerText =
            __users.users[Data_2011_.CurrentUser.id].display_name;
    }
    if (window.__users_loading_waiter) __users_loading_waiter.then(_tmp1)
    else _tmp1();

    return arguments[0];
})('JavaScriptWrapper');