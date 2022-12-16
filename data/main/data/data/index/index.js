(function (window) {

    if (self.localStorage.getItem('rj2011_data.agree_terms_of_use') === 'true') {
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
            if (confirm('是否同意《用户协议》及《隐私政策》？')) {
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
            // diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
            diffDate = (myDate_1 - myDate_2) // 不取相差毫秒数的绝对值
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

    function notInterested(el, tag = null) {
        el.remove();
        // TODO: 大数据推荐
        parent.postMessage({
            api: 'showinfo',
            args: ['将减少此类内容推荐', 'error']
        }, location.origin)
    }

    function createCard(t, d, m, a, l, g, x = null) {
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
        const dd = card.querySelector('.description');
        card.querySelector('.title').innerHTML = t;
        dd.innerHTML = d;
        dd.title = dd.innerText;
        card.$_tags = g;
        card.querySelector('.author').innerHTML = a;
        card.querySelector('.time').innerHTML = m;
        card.querySelector('.x').onclick = function (ev) {
            ev.stopPropagation();
            if (x) return x(ev);
            else {
                const menu = CreatePopupMenu();
                AppendMenu(menu, String, {}, '对此内容不感兴趣', function () {
                    notInterested(card);
                });
                AppendMenu(menu, 'separator');
                if (card.$_tags) for (let i of card.$_tags)
                AppendMenu(menu, String, {}, '不感兴趣: ' + i, function () {
                    notInterested(card, i);
                });
                AppendMenu(menu, 'separator');
                AppendMenu(menu, String, {}, '取消');
                const rect = card.querySelector('.x').getBoundingClientRect();
                TrackPopupMenu(menu, rect.left, rect.top);
            }
        };
        card.onclick = function (_) {
            if (l.startsWith('http')) {
                window.open(l, '_blank');
                return
            }

            parent.postMessage({
                "type": "redirect_hash",
                "url": l,
                "blank": (_ === 'open_in_blank' ? 'blank' : (_ === 'open_in_new_window' ? 'newWindow' : false)),
            }, location.origin);
        };
        card.onkeydown = function (ev) {
            if (ev.key.toLowerCase().includes('enter')) return this.onclick(ev);
        };
        card.onmousedown = function (ev) {
            if (ev.button === 1) return this.onclick('open_in_blank') && false;
        }
        card.oncontextmenu = function (ev) {
            ev.preventDefault();
            
            const menu = CreatePopupMenu();
            AppendMenu(menu, String, {}, '打开 (Enter)', function () {
                card.onclick();
            });
            AppendMenu(menu, 'separator');
            AppendMenu(menu, String, {}, '在新标签页中打开', function () {
                card.onclick('open_in_blank');
            });
            AppendMenu(menu, String, {}, '在新窗口中打开', function () {
                card.onclick('open_in_new_window');
            });
            AppendMenu(menu, 'separator');
            AppendMenu(menu, String, {}, '取消 (Esc)');

            TrackPopupMenu(menu, ev.x, ev.y);
        }
        return card;
    }

    function parse_content_data(data) {
        for (const i of data.top.items) {
            contents_top.append(createCard('<b style="color:red">[置顶] </b>' + i.title, i.des, i.time, i.author, i.href, i.tags))
        }
        const randarr = arrshuffle(data.random.items, false)
        for (const i of randarr) {
            contents_it.append(createCard(i.title, i.des, i.time, i.author, i.href, i.tags))
        }
    }

    (async function period(n) {
        const dld = contents.querySelector('[data-loading-data]') || {};
        const path = `data/articles-${n}.json`;
        let resp = await fetch(path);
        if (!resp.ok) {
            dld.innerHTML = '没有更多了';
            setTimeout(() => dld.remove(), 2000);
            return;
        }

        try {
            const json = (await resp.json());
            if (json.paused === true) {
                dld.innerHTML = '点击加载更多'
                dld.onclick = function () {
                    dld.onclick = null
                    dld.innerHTML = '正在加载'
                    period(n + 1)
                }
                return
            }
            parse_content_data(json)
        }
        catch (erro) {
            console.warn('Unable to load data in period', n, '\n', erro);
        }

        period(n + 1);
    })(0);

    function arrshuffle(arr = [], keep = true) {
        let newArr = keep ? arr.concat() : arr;
        newArr.sort(() => Math.random() - 0.5);
        return newArr;
    }



})(globalThis)


