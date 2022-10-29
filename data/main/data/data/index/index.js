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
            if (confirm('是否同意《用户协议》及《隐私政策》？')) {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'true');
                unofficial_tips.style.height = 0 + 'px';
                ev.target.parentElement.remove();
            } else {
                localStorage.setItem('rj2011_data.agree_terms_of_use', 'false');
                top.location = Math.random();
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
        if (examtime.getMonth() > 6 || (examtime.getMonth() === 6 && examtime.getDate() > 18))
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


})(globalThis)


