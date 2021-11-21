(function(){
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

        if(hash == '/exit/0') return window.close() || AbortAndDisablePage();
    }
    window.addEventListener('hashchange', onhashchange);
    onhashchange(null);

    function AbortAndDisablePage(){
        let _ = document.createElement('div');
        _.style.width = _.style.height = "100%";
        _.style.position = "fixed";
        _.style.left = _.style.top = 0;
        _.style.zIndex = 100000;
        _.style.cursor = 'not-allowed';
        _.style.background = 'rgba(255, 255, 255, 0.5)';
        _.onmousedown = _.onkeydown =
        function(e){
            e.preventDefault();
            _.style.background = 'white';
            return false;
        }
        _.onmouseup = _.onkeyup = _.oncontextmenu = function(e){
            e.preventDefault();
            _.style.background = 'rgba(255, 255, 255, 0.5)';
            return false;
        }
        document.body.appendChild(_);
    }
    function UserReportFetchError(des = '', important = false, report = null) {
        if(!des) des = '没有详情';
        var _ = document.createElement('div');
        _.hidden = true;
        // _.title = "JavaScript 错误";
        document.body.appendChild(_);
        _.innerHTML = `<b style="color:red">此页面上的 JavaScript 出现了一个错误。</b><br>
        您想做什么?<br><br>
        <div style="font-size:smaller">错误详情:<br>
        <textarea style="border:0;width:100%;" rows=6></textarea></div>`;
        _.querySelector('textarea').value = des;
        var _buttons = {
            "终止": function() {
                $(this).dialog("destroy");
                _.remove();
                AbortAndDisablePage();
            },
            "重试": function() {
                $(this).dialog("destroy");
                location.reload(true);
            },
            "忽略": function() {
                if(important) if(!confirm("忽略后可能会导致意想不到的结果!!"+
                "\n确定忽略此错误并继续?")) return;
                $(this).dialog("destroy");
                _.remove();
            }
        };
        if(report) _buttons["反馈"] = function() {
            if(report == undefined) return;
            if(typeof(report) == 'function') report(); else
            location.href = "mailto:" + report;
        };
        $(function() {
            $(_).dialog({
                modal: true,
                title: 'JavaScript 错误',
                width: 324,
                open: function () {
                    $(".ui-dialog-titlebar-close", $(this).parent()).hide();
                },
                buttons: _buttons
            });
        });
    }

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