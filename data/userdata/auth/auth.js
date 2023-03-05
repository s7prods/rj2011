(function () {
    

    globalThis.GetUserInfoFromJSON = async function GetUserInfoFromJSON(query, json = null) {
        if (json === null) {
            const resp = await fetch('data/userdata/users.json');
            json = await resp.json();
        }

        for (const i in json.users) {
            const d = json.users[i];
            let success = false;
            for (const j of d['user.auth.name']) {
                if (j === query) { success = true; break; }
            }
            if (success) {
                return {
                    uuid: i,
                    data: d,
                };
            }
        }
        return null;
    }
    globalThis.GetUserProfile = async function GetUserProfile(loc) {
        const resp = await (await fetch('data/userdata/' + loc)).json();
        return resp;
    }

    globalThis.requestLogin = async function requestLogin(opt = {}) {
        if (opt.username) try {
            console.log('[User] Trying to login with the following data:', opt);
            const user = await GetUserInfoFromJSON(opt.username);
            if (!user) {
                showinfo('找不到账户: ' + opt.username, 'error');
                return { success: false, response: 'Account Not Found' };
            }
            const ud = user.data;
            
            const prof = await GetUserProfile(ud['user.profile.location']);
            if (!prof['user.auth']) {
                LoginResult(false, '此账户没有指定登录方式。\n若需要登录，请联系网站管理员。');
                return { success: false, response: 'No Authorization Method' };
            }
            console.log('[User] User', opt.username, "'s profile parsed successfully:", prof);
            const auth = (prof['user.auth']);
            if (auth.noLogin) {
                LoginResult(false, auth.noLogin === true ? '此账户被配置为无法登录。' : auth.noLogin);
                return { success: false, response: 'Access Denied' };
            }


            if (auth.password) {
                if (opt.password) {
                    // TODO
                    return { success: true };
                }

                if (Reflect.ownKeys(auth).length <= 1) {
                    return { success: false, response: 'Password Required' };
                }
            }


            if (auth.question) {
                if (Reflect.ownKeys(auth).length <= 1)
                
                return { success: false, response: 'More Information Needed', what_information_needed: 'question', question_list: auth.question.list };
            }




            showinfo('未提供登录信息。', 'error');
            return { success: false, response: 'No Logon Informations' };
        } catch (err) {
            console.error(err);
            return { success: false, response: String(err) };
        }

        return { success: false, response: 'Invalid data' }
    }





    function LoginResult(success, text) {
        console.log(success, text);
    }


})();