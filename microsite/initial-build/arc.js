
(function () {
  document.documentElement.classList.add('js');
  var NS = 'http://www.w3.org/2000/svg', n = 0;

  function build(el) {
    var text = el.getAttribute('data-arc');
    var deg = parseFloat(el.getAttribute('data-bend') || 60);
    var dir = el.getAttribute('data-dir') || 'up';
    var em = parseFloat(el.getAttribute('data-em') || .5);
    var fs = 100, pad = 30;
    var len = text.length * fs * em * 1.3;           
    var th = deg * Math.PI / 180, r = len / th;
    var chord = 2 * r * Math.sin(th / 2), sag = r * (1 - Math.cos(th / 2));
    var W = chord + pad * 2, H, d, y;
    if (dir === 'up') {
      y = fs + pad + sag; H = y + pad;
      d = 'M' + pad + ',' + y + ' A' + r + ',' + r + ' 0 0 1 ' + (pad + chord) + ',' + y;
    } else {
      y = fs + pad; H = y + sag + fs * .3 + pad;
      d = 'M' + pad + ',' + y + ' A' + r + ',' + r + ' 0 0 0 ' + (pad + chord) + ',' + y;
    }
    var id = 'arcpath' + (n++);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W.toFixed(1) + ' ' + H.toFixed(1));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('id', id); p.setAttribute('d', d); p.setAttribute('fill', 'none');
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('font-size', fs);
    if (el.hasAttribute('data-italic')) t.setAttribute('font-style', 'italic');
    var tp = document.createElementNS(NS, 'textPath');
    tp.setAttribute('href', '#' + id);
    tp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + id);
    tp.setAttribute('startOffset', '50%');
    tp.setAttribute('text-anchor', 'middle');
    tp.textContent = text;
    t.appendChild(tp); svg.appendChild(p); svg.appendChild(t);
    el.appendChild(svg);
    if (el.tagName === 'A' && !el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
  }
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-arc]'), build);
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (i) { i.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (i) { io.observe(i); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
