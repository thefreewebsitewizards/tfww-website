(function () {
  'use strict';

  var META_PIXEL_ID = '3032047526979670';
  var GA_MEASUREMENT_ID = 'G-QWWSYRKH49';

  // Google Analytics 4
  var gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  // Meta Pixel
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');

  // Custom event helpers
  window.tfwwTrack = function (eventName, params) {
    params = params || {};

    // GA4
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }

    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName, params);
    }
  };

  // Track CTA clicks
  document.addEventListener('click', function (e) {
    var button = e.target.closest('[data-track]');
    if (button) {
      var trackEvent = button.getAttribute('data-track');
      var trackLabel = button.getAttribute('data-track-label') || '';
      window.tfwwTrack(trackEvent, { label: trackLabel });
    }
  });
})();
