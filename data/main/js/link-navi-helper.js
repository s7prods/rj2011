document.documentElement.addEventListener('click', function (ev) {
    if (ev.target.tagName.toUpperCase() !== 'A') return;
    const href = ev.target.getAttribute('href');
    if (!href) return;
    ev.preventDefault();

    if (href.startsWith('javascript:')) {
        return;
    }
    ev.stopPropagation();

    if (href.startsWith('//') || href.startsWith('http')) {
        window.open(href, '_blank');
        return false;
    }

    let p = (href.startsWith('#/')) ? (href.replace('#/', '')) : ((ev.target.getAttribute('data-article') ? 'article' : 'page') + '/' + href);
    parent.postMessage({
        "type": "redirect_hash",
        "url": p
    }, location.origin);
}, {
    capture: true,
});
