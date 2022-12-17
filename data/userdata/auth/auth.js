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

    globalThis.requestLogin = async function requestLogin(opt = {}) {
        if (opt.username && !opt.password) {
            const user = await GetUserInfoFromJSON(opt.username);
            if (!user) {
                showinfo('找不到账户: ' + opt.username, 'error');
                throw 'AccountNotFoundError';
            }


            return {
                success: false,
                response: 'More Information Needed',
                what_information_needed: 'question',
                question_list: q
            };

            return {
                success: true
            };
        }


    }


})();