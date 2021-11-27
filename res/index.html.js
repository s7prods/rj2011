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
            }
            
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

    return arguments[0];
})('JavaScriptWrapper');