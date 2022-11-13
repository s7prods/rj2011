(function (window) {

    if (localStorage.getItem('rj2011_data.agree_terms_of_use') === 'true') {
        unofficial_tips.remove();
    } else {
        btn_continue.onclick = function (ev) {
            let rect = ev.target.getBoundingClientRect();
            let menu = CreatePopupMenu();
            AppendMenu(menu, String, {}, 'Agree', function () {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'true');
                unofficial_tips.style.height = 0 + 'px';
                ev.target.parentElement.remove();
            });
            AppendMenu(menu, String, {}, 'Disagree', function () {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'false');
                top.location = Math.random();
            });
            TrackPopupMenu(menu, rect.left, rect.bottom);
        }
        btn_icantunderstanden.onclick = function (ev) {
            if (top.confirm('是否同意《用户协议》及《隐私政策》？')) {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'true');
                unofficial_tips.style.height = 0 + 'px';
                ev.target.parentElement.remove();
            } else {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'false');
                location = Math.random();
            }
        }
    }


    {
        function getDiffDay(date_1, date_2) {
             // https://blog.csdn.net/weixin_45891332/article/details/125652822
            // 计算两个日期之间的差值
            let totalDays, diffDate
            let myDate_1 = Date.parse(date_1)
            let myDate_2 = Date.parse(date_2)
            // 将两个日期都转换为毫秒格式，然后做差
            diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
            //diffDate = Number(myDate_1 - myDate_2) // 取相差毫秒数常数值
            totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
            return totalDays    // 相差的天数
        }

        const el = exam_time;
        let examtime = new Date();
        if (examtime.getMonth() > 5 || (examtime.getMonth() === 5 && examtime.getDate() > 18))
            examtime.setFullYear(examtime.getFullYear() + 1);
        examtime.setMonth(6 - 1);
        examtime.setDate(18);
        examtime.setHours(0, 0, 0, 0);

        setInterval(function () {
            const cur = new Date();
            const t = new Date(examtime - cur);
            let d = getDiffDay(examtime, cur);
            el.innerText = `${d}天 ${t.getHours()}小时 ${t.getMinutes()}分钟 ${t.getSeconds()}秒`;
        }, 1000);
    }

    const contents = document.getElementById('contents');
    const contents_top = contents.querySelector('.top');
    const contents_it = contents.querySelector('.it');

    function createCard(t, d, m, a, l, x = null) {
        let card = document.createElement('content-card');
        card.innerHTML = `
            <div class=title></div>
            <div class=description></div>
            <div class=footer>
                <span class=author></span>
                <span class=time></span>
                <span class=x>x</span>
            </div>
        `;
        card.tabIndex = 0;
        card.querySelector('.title').innerHTML = t;
        card.querySelector('.description').innerHTML = d;
        card.querySelector('.author').innerHTML = a;
        card.querySelector('.time').innerHTML = m;
        card.querySelector('.x').onclick = function (ev) {
            ev.stopPropagation();
            if (x) return x(ev);
        };
        card.onclick = function () {
            parent.postMessage({
                "type": "redirect_hash",
                "url": l
            }, location.origin);
        };
        return card;
    }

    function parse_content_data(data) {
        for (const i of data.top.items) {
            contents_top.append(createCard('<b style="color:red">[置顶] </b>' + i.title, i.des, i.time, i.author, i.href))
        }
    }

    (async function period(n) {
        const path = `data/articles-${n}.json`;
        let resp = await fetch(path);
        if (!resp.ok) {
            contents.querySelector('[data-loading-data]').remove();
            return;
        }

        try {
            parse_content_data(await resp.json());
        }
        catch (erro) {
            console.warn('Unable to load data in period', n, '\n', erro);
        }

        period(n+1);
    })(0);


})(globalThis)


