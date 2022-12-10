(async function () {

    let data = {};

    try {
        if (window.__resource_base__) {
            data = await storageAPI.getStorage();
        } else
        (data = JSON.parse(localStorage.getItem('rj2011_data')))
        if (!data) throw new Error('data not found');
    }
    catch (err) {
        console.warn(`rj2011_data not found or cannot be parsed, recreate it\n`, err);
        data = {};
        store_data();
    }

    let _rj2011_data = new Proxy(data, {
        get(target, p, receiver) {
            if (p === 'update') {
                store_data();
                return true;
            }
            return Reflect.get(target, p, receiver);
        },
        set(target, p, newValue, receiver) {
            store_data();
            return Reflect.set(target, p, newValue, receiver); // (2)
        }
    });
    Object.defineProperty(globalThis, 'rj2011_data', {
        get() { return _rj2011_data },
        set(value) { store_data(value); data = value; return true },
        enumerable: true,
        configurable: true,
    });


    let all_users;
    let my_profile;





    globalThis.data_init = async function () {
        try {
            all_users = await (await fetch('data/userdata/users.json')).json();

            await LoadUserInfo();
        } catch (error) {
            console.error('[ERROR] 无法加载用户数据', error);
            showinfo('严重: 无法加载用户数据:\n' + error, 'error', 10000);
        }
    }


    async function LoadUserInfo() {
        try {
            let cur = (rj2011_data.user.current);
            return await LoadSpecUserInfo(cur.id);
        }
        catch {
            return await LoadSpecUserInfo('c51bac0d-a6fd-41ba-8b74-a30874c7aef8');
        }
    }
    async function LoadSpecUserInfo(id) {
        my_profile = await (await fetch('data/userdata/' + all_users.users[id]['user.profile.location'])).json();
        await InitUserComponents(all_users.users[id], my_profile);
    }



    async function InitUserComponents(userinfo, prof) {

        let loginbtn = document.querySelector('#main nav .login-button')
        if (!loginbtn) return false;

        if (prof['profile.avatar'])
            loginbtn.querySelector('img').src = 'data/userdata/' + userinfo['user.profile.location'] + '/../' + prof['profile.avatar'];
        else loginbtn.querySelector('img').alt = prof['user.nickname'];

        let pop_if_ctl = CreatePopupMenu();

        AppendMenu(pop_if_ctl, String, { disabled: true }, prof['user.nickname']);
        AppendMenu(pop_if_ctl, String, { disabled: true }, 'UID: ' + userinfo['user.id']);
        AppendMenu(pop_if_ctl, 'separator');
        if (userinfo['user.name'] === 'guest') {
            AppendMenu(pop_if_ctl, String, {}, '登录', function () {
                location.hash = '#/account/login/'
            });
        } else {
            AppendMenu(pop_if_ctl, String, {}, '个人主页', function () {
                location.hash = '#/user/me/profile'
            });
            AppendMenu(pop_if_ctl, 'separator');
            AppendMenu(pop_if_ctl, String, {}, '修改昵称', function () {
                location.hash = '#/account/edit/nickname'
            });
            AppendMenu(pop_if_ctl, String, {}, '修改头像', function () {
                location.hash = '#/account/edit/avatar'
            });
            AppendMenu(pop_if_ctl, String, {}, '修改签名', function () {
                location.hash = '#/account/edit/sign'
            });
        }
        AppendMenu(pop_if_ctl, 'separator');
        AppendMenu(pop_if_ctl, String, {}, '退出登录', function () {
            location.hash = '#/account/logout/confirm'
        });


        loginbtn.addEventListener('click', function () {
            let rect = loginbtn.getBoundingClientRect();

            TrackPopupMenu(pop_if_ctl,
                document.documentElement.clientWidth - rect.right,
                rect.bottom + 5,
                { closeOnBlur: true, align: { right: true } });
        });
    }




    function store_data(val = data) {
        if (globalThis.__resource_base__) {
            return storageAPI.setStorage(val);
        }
        localStorage.setItem('rj2011_data', JSON.stringify(val));
    }



    if (window.dependencies) dependencies.done('data_init.js');

}())
