// Set active menu item for by_year page
(function() {
  var pathname = window.location.pathname;
  if (/by_year/.test(pathname) || /by_year\.html/.test(pathname)) {
    $('#menu-item-by-year').addClass('active');
  }
})();
