document.documentElement.addEventListener('click', function (ev) {
    if (ev.target.tagName.toUpperCase() !== 'A') return;
    if (!ev.target.getAttribute('href')) return;
    ev.preventDefault();

    parent.location.hash = '#/' + (ev.target.getAttribute('data-article') ? 'article' : 'page') + '/' + ev.target.getAttribute('href');
}, {
    capture: true,
});
