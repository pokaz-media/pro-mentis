/* ------------------------------------------------------------------
   Wyszukiwarka („lupka”) — wspólna dla wszystkich pięciu stron.

   Indeks nie jest utrzymywany ręcznie: przy pierwszym otwarciu skrypt
   czyta treść stron (bieżącą z DOM, pozostałe przez fetch + DOMParser)
   i wyciąga z nich usługi, pozycje cennika, karty zespołu z godzinami,
   paragrafy regulaminu i polityki prywatności oraz oferty z Kariery.
   Zmiana treści na stronie = zmiana w wynikach, bez dodatkowej edycji.

   Bez JS przycisk zostaje ukryty (atrybut hidden w nagłówku), więc nic
   nie wisi martwe. Przy otwarciu z file:// fetch nie działa — wtedy
   przeszukiwana jest tylko bieżąca strona.
   ------------------------------------------------------------------ */
(function () {
  var toggle = document.querySelector('[data-search-open]');
  if (!toggle || typeof document.createElement('dialog').showModal !== 'function') return;
  toggle.hidden = false;

  var PAGES = ['index.html', 'regulamin.html', 'polityka-prywatnosci.html', 'kariera.html'];
  var here = (location.pathname.split('/').pop() || 'index.html');
  if (PAGES.indexOf(here) === -1 && here !== 'dziekujemy.html') here = 'index.html';

  /* Skróty pokazywane przy pustym polu — to, o co pacjenci pytają najczęściej. */
  var QUICK = [
    { t: 'Godziny przyjęć specjalistów', c: 'Grafik', u: 'index.html#godziny' },
    { t: 'Regulamin wizyt', c: 'Regulamin', u: 'regulamin.html' },
    { t: 'Cennik', c: 'Cennik', u: 'index.html#cennik' },
    { t: 'Bezpłatna konsultacja 15 minut', c: 'Zapisy', u: 'index.html#bezplatna-konsultacja' },
    { t: 'Jak do nas trafić', c: 'Poradnia', u: 'index.html#dojazd' },
    { t: 'Kontakt i telefon', c: 'Kontakt', u: 'index.html#kontakt' }
  ];

  /* ---------- narzędzia ---------- */
  var fold = function (s) {
    return (s || '').toLowerCase()
      .replace(/ł/g, 'l')
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  };
  /* Polska odmiana: „terapii” ma trafiać w „terapia”, „godzinach” w „godziny”.
     Zamiast słownika ucinamy końcówkę dłuższych słów i szukamy po początku;
     trafienie całym słowem waży więcej niż samym rdzeniem („regulamin” nad „regularną”). */
  var words = function (q) {
    return fold(q).split(/[^a-z0-9:]+/).filter(function (w) { return w.length > 1 || /\d/.test(w); });
  };
  var stem = function (w) { return /\d/.test(w) || w.length < 5 ? w : w.slice(0, Math.max(4, w.length - (w.length >= 8 ? 3 : 2))); };
  var terms = function (q) { return words(q).map(stem); };
  var reEsc = function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  var fieldScore = function (e, w) {
    var re = new RegExp('(^|[^a-z0-9])' + reEsc(w));
    if (re.test(e.ft)) return 6; if (e.ft.indexOf(w) > -1) return 4;
    if (re.test(e.fk)) return 3; if (e.fk.indexOf(w) > -1) return 2;
    if (re.test(e.fx)) return 1.5; if (e.fx.indexOf(w) > -1) return 1;
    return 0;
  };
  var clean = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
  var txt = function (el) { return el ? clean(el.textContent) : ''; };
  var esc = function (s) {
    return s.replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  };
  var link = function (page, hash) {
    if (page === here) return hash ? '#' + hash : page;
    return page + (hash ? '#' + hash : '');
  };

  /* ---------- budowa indeksu ---------- */
  var fromIndex = function (doc, out) {
    var P = 'index.html';
    var each = function (sel, fn) { Array.prototype.forEach.call(doc.querySelectorAll(sel), fn); };

    each('main > section[id]', function (sec) {
      var h = sec.querySelector('.section-title') || sec.querySelector('h2');
      if (!h) return;
      out.push({ t: txt(h), c: txt(sec.querySelector('.eyebrow')) || 'Strona', u: link(P, sec.id),
                 x: txt(sec.querySelector('.lede')) });
    });

    each('.offer-card', function (card) {
      out.push({ t: txt(card.querySelector('h3')), c: 'Oferta', u: link(P, 'oferta'),
                 x: txt(card.querySelector('p')) });
    });

    each('.price-group', function (g) {
      var group = txt(g.querySelector('.price-group-head'));
      Array.prototype.forEach.call(g.querySelectorAll('.price-row'), function (row) {
        var amount = txt(row.querySelector('.price-amount'));
        var dur = txt(row.querySelector('.price-dur'));
        out.push({ t: txt(row.querySelector('h4')), c: 'Cennik · ' + group, u: link(P, 'cennik'),
                   x: [amount, dur].filter(Boolean).join(' · '), k: 'cena koszt ile kosztuje' });
      });
    });

    each('.member[id]', function (m) {
      var hours = Array.prototype.map.call(m.querySelectorAll('.member-hours li'), function (li) {
        return txt(li.querySelector('span')) + ' ' + txt(li.querySelector('b'));
      });
      var none = txt(m.querySelector('.member-hours-none'));
      var areas = Array.prototype.map.call(m.querySelectorAll('.member-creds li'), txt).join(' ');
      out.push({
        t: txt(m.querySelector('h3')), c: 'Zespół', u: link(P, m.id),
        x: txt(m.querySelector('.role')) + ' · Godziny przyjęć: ' + (hours.length ? hours.join(', ') : none),
        k: 'godziny pracy przyjęć grafik terapeuta specjalista ' + areas + ' ' + txt(m.querySelector('p')) + ' ' + txt(m.querySelector('.member-superv'))
      });
    });

    var hrs = doc.getElementById('godziny');
    if (hrs) {
      out.push({ t: 'Godziny przyjęć specjalistów', c: 'Grafik', u: link(P, 'godziny'),
                 x: 'Tabela godzin pracy wszystkich specjalistów, od poniedziałku do soboty.',
                 k: 'godziny pracy grafik terminy dni tygodnia ' + Array.prototype.map.call(hrs.querySelectorAll('tbody th'), txt).join(' ') });
    }

    each('#dojazd .locate-block', function (b) {
      out.push({ t: txt(b.querySelector('h4')), c: 'Poradnia', u: link(P, 'dojazd'),
                 x: txt(b).replace(txt(b.querySelector('h4')), '').trim(), k: 'dojazd adres parking jak dojechać' });
    });
    each('#dojazd figcaption', function (f) {
      out.push({ t: txt(f), c: 'Poradnia · zdjęcia', u: link(P, 'dojazd'), x: '' });
    });

    each('#kontakt .ci-row', function (r) {
      out.push({ t: txt(r.querySelector('h4')) + ': ' + txt(r.querySelector('.big')), c: 'Kontakt', u: link(P, 'kontakt'),
                 x: txt(r.querySelector('p')) });
    });

    var free = doc.getElementById('bezplatna-konsultacja');
    if (free) {
      out.push({ t: txt(free.querySelector('h3')), c: 'Zapisy', u: link(P, 'bezplatna-konsultacja'),
                 x: txt(free.querySelector('p')), k: 'bezplatna darmowa gratis pierwsza konsultacja google meet' });
    }
  };

  var fromLegal = function (doc, page, label, out) {
    var h1 = doc.querySelector('.legal-head h1, main h1');
    if (h1) out.push({ t: txt(h1), c: label, u: link(page), x: txt(doc.querySelector('.legal-head .lede')),
                       k: page === 'regulamin.html' ? 'regulamin wizyt zasady' : 'rodo dane osobowe prywatnosc' });
    Array.prototype.forEach.call(doc.querySelectorAll('.legal-body > h2[id]'), function (h) {
      var body = [], n = h.nextElementSibling;
      while (n && n.tagName !== 'H2') { body.push(txt(n)); n = n.nextElementSibling; }
      out.push({ t: txt(h), c: label, u: link(page, h.id), x: body.join(' ') });
    });
  };

  var fromCareer = function (doc, out) {
    Array.prototype.forEach.call(doc.querySelectorAll('.job'), function (job) {
      out.push({ t: txt(job.querySelector('h3')), c: 'Kariera', u: link('kariera.html', job.id),
                 x: txt(job).replace(txt(job.querySelector('h3')), '').trim(), k: 'praca rekrutacja wspolpraca' });
    });
  };

  var parse = function (page, doc, out) {
    if (page === 'index.html') fromIndex(doc, out);
    else if (page === 'regulamin.html') fromLegal(doc, page, 'Regulamin', out);
    else if (page === 'polityka-prywatnosci.html') fromLegal(doc, page, 'Polityka prywatności', out);
    else if (page === 'kariera.html') fromCareer(doc, out);
  };

  var index = null, building = null;
  var build = function () {
    if (building) return building;
    var out = [];
    var jobs = PAGES.map(function (page) {
      if (page === here) { parse(page, document, out); return Promise.resolve(); }
      return fetch(page).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
        if (html) parse(page, new DOMParser().parseFromString(html, 'text/html'), out);
      }).catch(function () { /* file:// albo brak sieci — zostaje bieżąca strona */ });
    });
    building = Promise.all(jobs).then(function () {
      out.forEach(function (e) {
        e.ft = fold(e.t); e.fx = fold(e.x); e.fk = fold(e.k || '') + ' ' + fold(e.c);
      });
      index = out.filter(function (e) { return e.t; });
      return index;
    });
    return building;
  };

  /* ---------- wyszukiwanie ---------- */
  var search = function (q) {
    var ws = words(q);
    if (!ws.length) return [];
    var hits = [];
    index.forEach(function (e) {
      var score = 0;
      for (var i = 0; i < ws.length; i++) {
        var s = fieldScore(e, ws[i]) || 0.6 * fieldScore(e, stem(ws[i]));
        if (!s) return;              /* każde słowo zapytania musi się znaleźć */
        score += s;
      }
      hits.push({ e: e, s: score });
    });
    hits.sort(function (a, b) { return b.s - a.s; });
    return hits.slice(0, 12).map(function (h) { return h.e; });
  };

  var mark = function (text, q) {
    var ts = terms(q);
    if (!ts.length) return esc(text);
    var f = fold(text), spans = [];
    ts.forEach(function (w) {
      var i = f.indexOf(w);
      while (i > -1) { spans.push([i, i + w.length]); i = f.indexOf(w, i + w.length); }
    });
    if (!spans.length) return esc(text);
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var html = '', pos = 0;
    spans.forEach(function (sp) {
      if (sp[0] < pos) return;
      html += esc(text.slice(pos, sp[0])) + '<mark>' + esc(text.slice(sp[0], sp[1])) + '</mark>';
      pos = sp[1];
    });
    return html + esc(text.slice(pos));
  };

  var snippet = function (text, q) {
    if (!text) return '';
    if (text.length <= 160) return text;
    var ts = terms(q);
    var f = fold(text), at = -1;
    for (var i = 0; i < ts.length && at < 0; i++) at = f.indexOf(ts[i]);
    if (at < 60) return text.slice(0, 157).replace(/\s+\S*$/, '') + '…';
    var start = text.lastIndexOf(' ', at - 50);
    return '…' + text.slice(start + 1, start + 158).replace(/\s+\S*$/, '') + '…';
  };

  /* ---------- okno ---------- */
  var dlg = document.createElement('dialog');
  dlg.className = 'search-dialog';
  dlg.setAttribute('aria-label', 'Szukaj na stronie');
  dlg.innerHTML =
    '<div class="search-bar">' +
      '<svg class="search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>' +
      '<input type="search" class="search-input" placeholder="Szukaj: regulamin, godziny, specjalista, cena…" aria-label="Szukaj na stronie" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="search-results">' +
      '<button type="button" class="search-close" aria-label="Zamknij">&times;</button>' +
    '</div>' +
    '<p class="search-status" aria-live="polite"></p>' +
    '<ul class="search-results" id="search-results" role="listbox"></ul>';
  document.body.appendChild(dlg);

  var input = dlg.querySelector('.search-input');
  var list = dlg.querySelector('.search-results');
  var status = dlg.querySelector('.search-status');
  var active = -1;

  var render = function () {
    var q = input.value.trim();
    var items = q ? search(q) : QUICK;
    active = -1;
    status.textContent = !q ? 'Na skróty' : (items.length ? 'Wyniki: ' + items.length : 'Brak wyników dla „' + q + '”. Spróbuj innego słowa albo zadzwoń: +48 693 979 397.');
    list.innerHTML = items.map(function (e, i) {
      return '<li role="option" id="sr-' + i + '"><a href="' + esc(e.u.indexOf('index.html') === 0 && here === 'index.html' ? e.u.slice(10) : e.u) + '">' +
        '<span class="sr-cat">' + esc(e.c) + '</span>' +
        '<span class="sr-title">' + mark(e.t, q) + '</span>' +
        (q && e.x ? '<span class="sr-text">' + mark(snippet(e.x, q), q) + '</span>' : '') +
        '</a></li>';
    }).join('');
  };

  var setActive = function (i) {
    var opts = list.querySelectorAll('li');
    if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    Array.prototype.forEach.call(opts, function (li, j) { li.classList.toggle('is-active', j === active); });
    input.setAttribute('aria-activedescendant', 'sr-' + active);
    opts[active].scrollIntoView({ block: 'nearest' });
  };

  var open = function () {
    if (dlg.open) return;
    dlg.showModal();
    input.value = '';
    status.textContent = 'Wczytywanie…';
    list.innerHTML = '';
    build().then(render);
    input.focus();
  };

  toggle.addEventListener('click', open);

  /* Poniżej 400px nagłówek nie mieści lupy obok pełnego logo i „Umów wizytę”,
     więc tam wyszukiwarka siedzi w rozwijanym menu (CSS przełącza, która widać). */
  var nav = document.getElementById('nav-main');
  if (nav) {
    var navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'nav-search';
    navBtn.textContent = 'Szukaj na stronie';
    nav.insertBefore(navBtn, nav.querySelector('.nav-phone'));
    navBtn.addEventListener('click', function () {
      var header = document.getElementById('header');
      if (header) header.classList.remove('nav-open');
      var mt = document.querySelector('.menu-toggle');
      if (mt) mt.setAttribute('aria-expanded', 'false');
      open();
    });
  }
  dlg.querySelector('.search-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  input.addEventListener('input', function () { if (index) render(); });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      var a = list.querySelectorAll('li a')[active < 0 ? 0 : active];
      if (a) { e.preventDefault(); a.click(); }
    }
  });

  /* Wybór wyniku: przy kotwicy na tej samej stronie zamknij okno i podświetl cel. */
  list.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href.charAt(0) !== '#') return;
    dlg.close();
    var target = document.getElementById(href.slice(1));
    if (target) {
      target.classList.remove('search-hit');
      void target.offsetWidth;
      target.classList.add('search-hit');
      setTimeout(function () { target.classList.remove('search-hit'); }, 2400);
    }
  });

  /* Skróty klawiszowe: Ctrl/⌘+K oraz „/” poza polami tekstowymi. */
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open(); }
    else if (e.key === '/' && !typing && !dlg.open) { e.preventDefault(); open(); }
  });
})();
