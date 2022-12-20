(async function () {
    
    const nop = function () { };

    let pref = await (await fetch('data/index.html/prefetch.json')).json();
    for (let i of pref) {
        fetch(i).catch(nop);
    }
    
})()
.catch(function(){})


