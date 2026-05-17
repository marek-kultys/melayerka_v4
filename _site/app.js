/* =====================================================================
   melayerka.com — app.js
   ===================================================================== */

/* ----- 1. localStorage colour-scheme persistence ------------------- */
(function () {
  var stored = localStorage.getItem('colorScheme');
  // Only apply stored preference if the page hasn't already set dark_default
  // (dark_default pages start with class="dark" on <body> via the layout)
  if (stored === 'dark' && !document.body.classList.contains('dark')) {
    document.body.classList.add('dark');
  } else if (stored === 'light' && document.body.classList.contains('dark')) {
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
    localStorage.setItem('colorScheme', isDark ? 'dark' : 'light');
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

/* ----- 3. Dual prev/next navigation context (series vs year) ------- */
(function () {
  var ctx = new URLSearchParams(window.location.search).get('ctx');
  if (ctx !== 'series') return;
  document.querySelectorAll('.nav-year').forEach(function (el) { el.hidden = true; });
  document.querySelectorAll('.nav-series').forEach(function (el) { el.hidden = false; });
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

/* ----- 5. Retina.js v1.3.0 ---------------------------------------- */
!function(){function a(){}function b(a){return f.retinaImageSuffix+a}function c(a,c){if(this.path=a||"","undefined"!=typeof c&&null!==c)this.at_2x_path=c,this.perform_check=!1;else{if(void 0!==document.createElement){var d=document.createElement("a");d.href=this.path,d.pathname=d.pathname.replace(g,b),this.at_2x_path=d.href}else{var e=this.path.split("?");e[0]=e[0].replace(g,b),this.at_2x_path=e.join("?")}this.perform_check=!0}}function d(a){this.el=a,this.path=new c(this.el.getAttribute("src"),this.el.getAttribute("data-at2x"));var b=this;this.path.check_2x_variant(function(a){a&&b.swap()})}var e="undefined"==typeof exports?window:exports,f={retinaImageSuffix:"@2x",check_mime_type:!0,force_original_dimensions:!0};e.Retina=a,a.configure=function(a){null===a&&(a={});for(var b in a)a.hasOwnProperty(b)&&(f[b]=a[b])},a.init=function(a){null===a&&(a=e);var b=a.onload||function(){};a.onload=function(){var a,c,e=document.getElementsByTagName("img"),f=[];for(a=0;a<e.length;a+=1)c=e[a],c.getAttributeNode("data-no-retina")||f.push(new d(c));b()}},a.isRetina=function(){var a="(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";return e.devicePixelRatio>1?!0:e.matchMedia&&e.matchMedia(a).matches?!0:!1};var g=/\.\w+$/;e.RetinaImagePath=c,c.confirmed_paths=[],c.prototype.is_external=function(){return!(!this.path.match(/^https?\:/i)||this.path.match("//"+document.domain))},c.prototype.check_2x_variant=function(a){var b,d=this;return this.is_external()?a(!1):this.perform_check||"undefined"==typeof this.at_2x_path||null===this.at_2x_path?this.at_2x_path in c.confirmed_paths?a(!0):(b=new XMLHttpRequest,b.open("HEAD",this.at_2x_path),b.onreadystatechange=function(){if(4!==b.readyState)return a(!1);if(b.status>=200&&b.status<=399){if(f.check_mime_type){var e=b.getResponseHeader("Content-Type");if(null===e||!e.match(/^image/i))return a(!1)}return c.confirmed_paths.push(d.at_2x_path),a(!0)}return a(!1)},b.send(),void 0):a(!0)},e.RetinaImage=d,d.prototype.swap=function(a){function b(){c.el.complete?(f.force_original_dimensions&&(c.el.setAttribute("width",c.el.offsetWidth),c.el.setAttribute("height",c.el.offsetHeight)),c.el.setAttribute("src",a)):setTimeout(b,5)}"undefined"==typeof a&&(a=this.path.at_2x_path);var c=this;b()},a.isRetina()&&a.init(e)}();
