// Set active menu item for by_year page
(function() {
  var pathname = window.location.pathname;
  if (/by_year/.test(pathname) || /by_year\.html/.test(pathname)) {
    var menuItem = document.getElementById('menu-item-by-year');
    if (menuItem) {
      menuItem.classList.add('active');
    }
  }
})();
