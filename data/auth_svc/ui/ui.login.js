window._tmp0 = (function () {
    function LastStepUserLogin(v) {
        if (__users.users[v].nologin) {
            let e = document.createElement('div');
            e.innerHTML = __users.users[v].nologin_text || "由于管理员的设置，此用户无法登录。";
            document.body.appendChild(e);
            $(e).dialog({
                "title": "系统错误",
                modal: true,
                'buttons': {
                    '关闭': function () { $(this).dialog('close') }
                },
                close: function () {
                    $(this).dialog("destroy");
                    LoginUi_submit_short.disabled = false;
                    LoginUi_submit_short.innerHTML = '验证';
                    e.remove();
                }
            })
            return false;
        }
        if (__users.users[v].password) {
            let e = document.createElement('div');
            e.innerHTML = "<b class=f-bigger>还差一步!</b><br>" +
                "您需要输入您的密码以验证您的身份。<br>" +
                `<div class=disp-flex>您的密码: <input style="flex: 100" placeholder` +
                `="请输入密码" autofocus type=password class=pswd />`;
            document.body.appendChild(e);
            $(function () {
                $(e).dialog({
                    title: "还差一步",
                    modal: true,
                    width: 'auto',
                    buttons: {
                        "确定": function () {
                            if (e.querySelector('.pswd').value ==
                                __users.users[v].password) {
                                Data_2011_.CurrentUser = { id: v, isLogin: true };
                                localStorage.data_rj2011 = JSON.stringify(Data_2011_);
                                location.href = '../../../';
                                return true;
                            } else {
                                let e = document.createElement('div');
                                e.innerHTML = "密码不正确。请重试。";
                                document.body.appendChild(e);
                                $(e).dialog({
                                    modal: true,
                                    width: 'auto',
                                    title: "密码错误",
                                    close: function () {
                                        $(this).dialog("destroy");
                                        LoginUi_submit_short.disabled = false;
                                        LoginUi_submit_short.innerHTML = '验证';
                                        e.remove();
                                    },
                                    buttons: {
                                        "关闭": function () {
                                            $(this).dialog("close");
                                        }
                                    }
                                })
                            }
                        },
                        "取消": function () {
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        $(this).dialog("destroy");
                        LoginUi_submit_short.disabled = false;
                        LoginUi_submit_short.innerHTML = '验证';
                        e.remove();
                    }
                })
            });
            return void 0;
        } else if (__users.users[v].verify_page) {
            let e = document.createElement('div');
            e.innerHTML = "<b class=f-bigger>还差一步!</b><br>" +
                "您当前输入的信息还不足以验证您的身份。<br>" +
                "点击[继续]以验证身份并登录,<br>或点击[取消]以取消。";
            document.body.appendChild(e);
            $(function () {
                $(e).dialog({
                    title: "还差一步",
                    modal: true,
                    width: 'auto',
                    buttons: {
                        "继续": function () {
                            location.href = __users.users[v].verify_page;
                        },
                        "取消": function () {
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        $(this).dialog("destroy");
                        LoginUi_submit_short.disabled = false;
                        LoginUi_submit_short.innerHTML = '验证';
                        e.remove();
                    }
                })
            });
        } else {
            let e = document.createElement('div');
            e.innerHTML = '<img src="../../../res/error.png" alt=Error />此用户无法登录，' +
                '因为登录验证配置不正确。<br /><div class=f-smaller>若仍要使用此用户登录，请' +
                '联系<i>Delomy</i>。</div>';
            document.body.appendChild(e);
            $(e).dialog({
                "title": "验证错误",
                modal: true,
                'buttons': {
                    '关闭': function () { $(this).dialog('close') }
                },
                close: function () {
                    $(this).dialog("destroy");
                    LoginUi_submit_short.disabled = false;
                    LoginUi_submit_short.innerHTML = '验证';
                    e.remove();
                }
            })
            return false;
        }
    }

    if (!(Data_2011_.CurrentUser && Data_2011_.CurrentUser.isLogin)) {
        document.title = '[登录] - ' + document.title;
        LoginUi_username.oninput = function () {
            this.value = this.value.toUpperCase();
        }
        LoginUi_username.onkeydown = function (e) {
            if (e.keyCode == 13) LoginUi_submit_short.click();
        }
        LoginUi_submit_short.onclick = function () {
            this.disabled = true;
            this.innerHTML = "正在验证...";
            var val = LoginUi_username.value;
            new Promise(function (resolve, reject) {
                let i = 0, l = 0;
                for (let k in __users.users) {
                    l = __users.users[k].name_loginable.length;
                    for (i = 0; i < l; ++i) {
                        if (val == __users.users[k].name_loginable[i])
                            resolve(k);
                    }
                }
                reject("找不到指定的用户。请检查拼写是否正确，然后再试。<br>" +
                    "若此问题仍出现，请联系<i>Delomy</i>。");
            }).then(function (v) {
                LastStepUserLogin(v);
            }, function (er) {
                let e = document.createElement('div');
                e.innerHTML = er;
                document.body.appendChild(e);
                $(function () {
                    $(e).dialog({
                        title: "验证失败",
                        modal: true,
                        buttons: {
                            "关闭": function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function () {
                            $(this).dialog("destroy");
                            LoginUi_submit_short.disabled = false;
                            LoginUi_submit_short.innerHTML = '验证';
                            e.remove();
                        }
                    })
                });
            });
        }
        $(function () {
            $('#LoginUi').dialog({
                title: document.title,
                modal: true,
                closeOnEscape: false,
                show: true,
                width: document.body.clientWidth - 8,
                height: document.body.clientHeight - 0,
                x: 0, y: 0,
                open: function (event, ui) {
                    $(".ui-dialog-titlebar-close", $(this).parent()).hide();
                    LoginUi_submit_short.disabled = true;
                },
                beforeclose: function () { return false },
                buttons: {
                    '取消': function () {
                        AbortAndDisablePage();
                    }
                }
            });
        });
        LoginUi_submit_short.disabled = true;
        fetch('../Data/usersShowInSelect.json').then(v => { return v.json() },
        e => UserReportFetchError('无法加载数据: ' + e)).then(function (v) {
            LoginUi_submit_short.disabled = false;
            let _l = v.length;
            let _p = LoginUi.querySelector('[data-select-user]');
            if (!_p) return false;
            _p.innerHTML = '';
            for (let i = 0; i < _l; ++i) {
                let el = document.createElement('a');
                el.style.display = "block";
                el.innerHTML = __users.users[v[i]].display_name;
                el.onclick = function () {
                    LastStepUserLogin([v[i]]);
                }
                _p.appendChild(el);
            }
        });
        return;
    }; // Data_2011_.CurrentUser.isLogin

    if (Data_2011_.CurrentUser.isLogin) {
        document.title = '[用户管理中心] - ' + document.title;
        UserManager.querySelector('[data-cun]').value =
            __users.users[Data_2011_.CurrentUser.id].display_name;
        UserManager.querySelector('[data-uid]').value =
            __users.users[Data_2011_.CurrentUser.id].uid;
        UserManager.querySelector('[data-uuid]').value = Data_2011_.CurrentUser.id;
        let gpel = UserManager.querySelector('[data-sgroups]'), _Mygp = [], _tEl = null;
        for (let i in __users.groups) {
            if (__users.users[Data_2011_.CurrentUser.id].groups.
                indexOf(__users.groups[i].gid) + 1) {
                _tEl = document.createElement('option');
                _tEl.innerText = __users.groups[i].display_name;
                gpel.appendChild(_tEl);
            }
        }
        // UserManager.querySelector('[data-copy]:nth-child(0)').onclick=()=>
        UserManager.hidden = false;
        $(UserManager).dialog({
            modal: false,
            title: document.title,
            width: document.body.clientWidth - 8,
            height: document.body.clientHeight - 0,//2,
            show: true,
            closeOnEscape: false,
            x: 0, y: 0,
            close: function () {
                location.href = '../../../';
            }
        });
    }
});
if (!__users_loading_waiter) { _tmp0(); delete _tmp0 }
else { __users_loading_waiter.then(_tmp0); delete tmp0 };