// Minimal JS: language toggle + lazy video autoplay in view + tap for sound.
(function () {
  // Language toggle (NL default, EN via data-en)
  var nodes = document.querySelectorAll('[data-en]');
  nodes.forEach(function (el) { el.dataset.nl = el.innerHTML; });
  // Links with a language-specific href (e.g. mailto subject)
  var hrefs = document.querySelectorAll('[data-en-href]');
  hrefs.forEach(function (el) { el.dataset.nlHref = el.getAttribute('href'); });
  var btn = document.getElementById('lang');
  var spans = btn.querySelectorAll('span');
  function setLang(l) {
    nodes.forEach(function (el) { el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.nl; });
    hrefs.forEach(function (el) { el.setAttribute('href', l === 'en' ? el.dataset.enHref : el.dataset.nlHref); });
    document.documentElement.lang = l;
    spans[0].classList.toggle('on', l === 'nl');
    spans[1].classList.toggle('on', l === 'en');
    try { localStorage.setItem('abr-lang', l); } catch (e) {}
  }
  var saved = null;
  // ?lang=en forces English (handy for sharing with US/CA/UK clients)
  var q = (location.search.match(/[?&]lang=(nl|en)/) || [])[1];
  try { saved = localStorage.getItem('abr-lang'); } catch (e) {}
  if (q) setLang(q); else if (saved === 'en') setLang('en');
  btn.addEventListener('click', function () { setLang(document.documentElement.lang === 'en' ? 'nl' : 'en'); });

  // Lazy-load work videos, play muted only while visible
  var vids = document.querySelectorAll('video.lazy');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px 0px', threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  } else {
    vids.forEach(function (v) { v.src = v.dataset.src; v.controls = true; });
  }

  // Tap a clip to toggle sound (only one unmuted at a time)
  vids.forEach(function (v) {
    var frame = v.parentElement;
    frame.addEventListener('click', function () {
      var unmute = v.muted;
      vids.forEach(function (o) { o.muted = true; o.parentElement.classList.remove('sound'); });
      if (unmute) {
        if (!v.src) v.src = v.dataset.src;
        v.muted = false; v.currentTime = 0; v.play();
        frame.classList.add('sound');
      }
    });
  });
})();
