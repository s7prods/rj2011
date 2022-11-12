(function () {

    let data;
    Object.defineProperty(globalThis, 'rj2011_data', {
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


    globalThis.GetUserPath = function GetUserPath(user) {
        return `data/main/data/userdata/${user}/`;
    }

    const __userinfocache = new Map();
    globalThis.GetUserInfo = async function g_u(user = null) {
        if (!user) {
            try { user = (rj2011_data.user.current.id) }
            catch (anyerr) { user = ('.guest'); }
        }
        if (__userinfocache.get(user)) {
            return __userinfocache.get(user);
        }
        let resp = await fetch(GetUserPath(user) + 'user.json')
        if (!resp.ok) return {
            status: -resp.status,
            statusText: resp.statusText
        };
        let json = await resp.json();
        json._user = user;
        if (user === '.guest') json.isGuest = true;
        __userinfocache.set(user, json);
        return json;
    }

    globalThis.LoadUserInfo = function luUser0(user = null) {
        if (user) {
            fetch(GetUserPath(user) + 'user.json')
            .then(v => v.json())
            .then(function (d) {
                document.querySelector('#main nav .login-button img').src = GetUserPath(user) + d.avatar
            })
            .catch(function (err) {
                console.error('Failed to load user', user, '\n',
                    'Error while loading data:', err);
            });
            return 0;
        }

        try {
            return luUser0(rj2011_data.user.current.id)
        }
        catch (anyerr) {
            return luUser0('.guest');
        }
    }

    globalThis.InitUserComponents = async function u_init() {
        // let loginbtn = document.querySelector('#main nav .login-button')
        // let dpd = document.querySelector('#main .user-dropdown-component')
        // if (!loginbtn) return false;
        // loginbtn.addEventListener('mouseover', function () {
        //     if (!dpd) return;
        //     let rect = loginbtn.getBoundingClientRect();
        //     dpd.style.right = (document.documentElement.clientWidth - rect.right) + 'px';
        //     dpd.style.top = rect.bottom + 10 + 'px';
        //     dpd.style.display = 'revert';
        //     dpd.classList.add('open');

        // });
        // if (dpd)
        // dpd.addEventListener('mouseout', function () {
        //     dpd.style.display = '';
        //     dpd.classList.remove('open');

        //})
        let loginbtn = document.querySelector('#main nav .login-button')
        if (!loginbtn) return false;
        let userinfo = await GetUserInfo();

        let pop_if_ctl = CreatePopupMenu();

        AppendMenu(pop_if_ctl, String, { disabled: true }, userinfo.username);
        AppendMenu(pop_if_ctl, String, { disabled: true }, 'UID: ' + userinfo.uid);
        AppendMenu(pop_if_ctl, 'separator');
        if (userinfo.isGuest) {
            AppendMenu(pop_if_ctl, String, {}, '登录', function () {
                location.hash = '#/account/login/'
            });
            AppendMenu(pop_if_ctl, 'separator');
        }


        loginbtn.addEventListener('mouseover', function () {
            let rect = loginbtn.getBoundingClientRect();

            pop_if_ctl.lastElementChild.style.right = (document.documentElement.clientWidth - rect.right) + 'px';
            TrackPopupMenu(pop_if_ctl, null, rect.bottom + 5, { closeOnBlur: true });
        });
    }




    function store_data() {
        localStorage.setItem('rj2011_data', JSON.stringify(data));
    }


}())
