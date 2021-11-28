(function (_w, _n) {
    'use strict';
    var _modules = {};
    _w.__define_module = function (ModuleName, fn) {
        if (typeof fn != 'function')
            throw new TypeError(`Cannot define a non-function module`);
        let _modulewrapper = function (_0, _1) {
            return _0;
        };
        if (_modules[ModuleName]) {
            console.warn(``)
        }
        _modules[ModuleName] = fn;
        return _modulewrapper(fn, ModuleName);
    };
    _w.__run_module = function (module) {
        if (typeof module == 'function') return module();
        if (typeof module == 'string') return _modules[module]();
        throw new TypeError(`Cannot run module because cannot ` +
            `understand argument <module>`);
        return null;
    }
    _w.__delete_module = function (ModuleName) {
        return delete _modules[ModuleName];
    }
})(window.self, 'com.module.ModuleManager.ModuleInit.__initial__');
(function (__ClassName__) {
    'use strict';
    
    // Base Data Read Module
    __run_module(__define_module('BaseDataReader', function () {
        var _2011ld = {};
        try {
            _2011ld = JSON.parse(localStorage.data_rj2011);
        } catch (e) {
            if (e.name != 'SyntaxError') throw e;
            console.warn(`==== Data Exception Warning ====\n`+
                `    Maybe user datas was changed Illegally.\n`+
                `    If this is the first time you have seen this prompt, safel`+
                `y ignore it.\nThis warning will be generated automatically whe`+
                `n you visit this page for\nthe first time. You don't have to ca`+
                `re.\n    If you see this prompt many times, it means that the `+
                `website data may\nhave been illegally tampered with. Please ch`+
                `eck whether your computer has\nvirus and whether the website ha`+
                `s been hijacked.\n    We have fixed this error, but this does `+
                `not guarantee that this warn-\ning will not repeat.\n`+
                `Good luck :)                           2011 Zoo Data Storager`);
            localStorage.data_rj2011 = JSON.stringify(_2011ld);
        }
        window.Data_2011_ = _2011ld;
    })); __delete_module('BaseDataReader');

    // Error Reporting Module
    __run_module(__define_module('ErrorReporter', function () {
        window.AbortAndDisablePage = function () {
            let _ = document.createElement('div');
            _.style.width = _.style.height = "100%";
            _.style.position = "fixed";
            _.style.left = _.style.top = 0;
            _.style.zIndex = 100000;
            _.style.cursor = 'not-allowed';
            _.style.background = 'rgba(255, 255, 255, 0.5)';
            _.onmousedown = _.onkeydown =
                function (e) {
                    e.preventDefault();
                    _.style.background = 'rgba(255, 255, 255, 0.8)';
                    return false;
                }
            _.onmouseup = _.onkeyup = _.oncontextmenu = function (e) {
                e.preventDefault();
                _.style.background = 'rgba(255, 255, 255, 0.5)';
                return false;
            }
            document.body.appendChild(_);
        }
        window.UserReportFetchError = function (des = '', important = false, report = null) {
            if (!des) des = '没有详情。';
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
                "终止": function () {
                    $(this).dialog("destroy");
                    _.remove();
                    AbortAndDisablePage();
                },
                "重试": function () {
                    $(this).dialog("destroy");
                    location.reload(true);
                },
                "忽略": function () {
                    if (important) if (!confirm("忽略后可能会导致意想不到的结果!!" +
                        "\n确定忽略此错误并继续?")) return;
                    $(this).dialog("destroy");
                    _.remove();
                }
            };
            if (report) _buttons["反馈"] = function () {
                if (report == undefined) return;
                if (typeof (report) == 'function') report(); else
                    location.href = "mailto:" + report;
            };
            $(function () {
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
    })); __delete_module('ErrorReporter');

    // User Information Loader
    __run_module(__define_module('UserInfoReader', function () {
        let _url = location.href;
        _url = _url.substr(_url.indexOf("//") + 2);
        _url = _url.substr(_url.indexOf("/") + 1);
        _url = _url.substr(_url.indexOf("rj2011") + 7);
        let _count_of_lastpath = 0, _s = '';
        if (_url.indexOf('#') + 1) _url = _url.substr(0, _url.indexOf('#'));
        if (_url.indexOf('/') + 1) {
            _count_of_lastpath = _url.split('/').length - 1;
        }
        for (let i = 0; i < _count_of_lastpath; ++i) _s += '../';

        window.__users_loading_waiter = fetch(_s + 'data/auth_svc/Data/users.json').then(
            v => { return v.json() }, e => UserReportFetchError('无法加载数据: ' + e, 1)
        ).then(function (v) {
            delete window.__users_loading_waiter;
            window.__users = v;
        });
    })); __delete_module('UserInfoReader');
    
})('com.js.ext.JavaScriptWrapper.main');