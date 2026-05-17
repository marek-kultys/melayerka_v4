/* =====================================================================
   melayerka.com — app.js
   ===================================================================== */

/* ----- 1. Mars series light/dark state across page navigations ----- */
(function () {
  var isMarsPage = /\/06_/.test(window.location.pathname);
  if (!isMarsPage) {
    sessionStorage.removeItem('marsColorScheme');
    return;
  }
  if (sessionStorage.getItem('marsColorScheme') === 'light') {
    document.body.classList.remove('dark');
  }
})();

/* ----- 2. Dark / Light toggle button ------------------------------- */
(function () {
  var btn = document.querySelector('.toggle-dark');
  if (!btn) return;

  var painting = document.querySelector('.painting img');

  function updateButtonText() {
    btn.textContent = document.body.classList.contains('dark')
      ? 'See in light'
      : 'See in dark';
  }

  btn.addEventListener('click', function () {
    var isDark = document.body.classList.toggle('dark');
    sessionStorage.setItem('marsColorScheme', isDark ? 'dark' : 'light');
    updateButtonText();

    if (!painting) return;

    if (isDark) {
      // switching to dark: load dark image
      var lightSrc = painting.getAttribute('data-light') || painting.getAttribute('src');
      var darkSrc  = painting.getAttribute('data-dark');
      if (darkSrc) {
        painting.setAttribute('data-light', lightSrc);
        painting.setAttribute('src', darkSrc);
      }
    } else {
      // switching to light: restore light image
      var lightSrc = painting.getAttribute('data-light');
      if (lightSrc) {
        painting.setAttribute('src', lightSrc);
      }
    }
  });

  // Ensure correct image is shown on page load (dark_default pages start dark)
  if (painting && document.body.classList.contains('dark')) {
    var darkSrc = painting.getAttribute('data-dark');
    if (darkSrc && painting.getAttribute('src') !== darkSrc) {
      painting.setAttribute('data-light', painting.getAttribute('src'));
      painting.setAttribute('src', darkSrc);
    }
  }
})();

/* ----- 3. by_year navigation context (ctx=year) -------------------- */
(function () {
  var ctx = new URLSearchParams(window.location.search).get('ctx');
  if (ctx !== 'year') return;
  document.querySelectorAll('.nav-series').forEach(function (el) { el.classList.add('nav-hidden'); });
  document.querySelectorAll('.nav-year').forEach(function (el) {
    el.classList.remove('nav-hidden');
    el.href = el.href + '?ctx=year';
  });
})();

/* ----- 4. by_year gallery: load thumbnail images on desktop -------- */
(function () {
  var pathname = window.location.pathname;
  if (!/by_year/.test(pathname) && !/gallery/.test(pathname)) return;
  if (!window.matchMedia('screen and (min-width: 64.063em)').matches) return;

  document.querySelectorAll('ol.gallery li').forEach(function (li) {
    var link = li.querySelector('.year a');
    if (link) {
      li.id = link.textContent.trim();
      link.href = window.location.pathname + '#' + li.id;
    }
    li.querySelectorAll('a[data-image]').forEach(function (a) {
      var img = document.createElement('img');
      img.src = a.getAttribute('data-image');
      a.appendChild(img);
    });
  });

  // Mark by-year link active in menu
  var byYearLink = document.getElementById('menu-item-by-year');
  if (byYearLink) byYearLink.classList.add('active');
})();
