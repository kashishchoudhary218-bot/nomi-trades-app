/*
 * app.js — UI wiring: routing, bindings, watchlist, chart, order ticket,
 * account selector, manage drawer and mock funding forms.
 */
(function (SIM) {
  'use strict';

  const E = SIM.engine;
  const { INSTRUMENTS, generateCandles } = SIM.data;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const TIMEFRAMES = [
    { label: '1m', sec: 60 }, { label: '5m', sec: 300 }, { label: '15m', sec: 900 },
    { label: '1H', sec: 3600 }, { label: '4H', sec: 14400 }, { label: '1D', sec: 86400 }
  ];
  const ICONS = {
    gold: ['#f5b53f', 'Au'], silver: ['#9aa3ad', 'Ag'], fx: ['#3b82f6', 'FX'],
    crypto: ['#f7931a', '₿'], index: ['#6366f1', 'IX'], oil: ['#111827', 'Oil']
  };

  // ---------- Formatting ----------
  const money = (v, sign) => {
    const s = (v < 0 ? '-' : sign && v > 0 ? '+' : '') + '$' +
      Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return s;
  };
  const masked = () => E.state.hideBalance;
  const maybe = (s) => (masked() ? '••••' : s);
  const px = (v, d) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const typeText = (a) => (a.type === 'sim' ? 'Simulated' : 'Practice');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Bindings ----------
  function bind(name, value, html) {
    $$('[data-bind="' + name + '"]').forEach((el) => { if (html) el.innerHTML = value; else el.textContent = value; });
  }

  function renderAccount() {
    const a = E.active();
    const m = E.metrics(a);
    document.body.dataset.acctType = a.type;

    const [whole, cents] = money(m.equity).split('.');
    bind('equityBig', masked() ? '$••••' : esc(whole) + '<small>.' + cents + '</small>', true);
    bind('equityShort', maybe(money(m.equity)));
    bind('plPill', maybe(money(m.pl, true)));
    $$('[data-bind="plPill"]').forEach((el) => el.classList.toggle('neg', m.pl < 0));
    bind('typeBadge', a.type === 'sim' ? 'SIM' : 'Practice');
    bind('typeBadgeText', typeText(a));
    bind('typeLabel', typeText(a));
    bind('planLabel', a.platform + ' ' + a.plan);
    bind('name', a.name);
    bind('number', '#' + a.number);
    bind('nameNumber', a.name + ' #' + a.number);
    bind('nameNumberFull', a.name + ' #' + a.number);
    bind('leverageLabel', a.leverage + ':1');
    bind('freeMargin', maybe(money(m.freeMargin)));
    bind('posCount', a.positions.length ? a.positions.length + ' open' : '');
    bind('footer', 'Balance: ' + maybe(money(m.balance)) + '   Equity: ' + maybe(money(m.equity)) +
      '   Margin: ' + maybe(money(m.margin)) + '   Free: ' + maybe(money(m.freeMargin)));

    const rows = [
      ['Unrealized P/L', maybe(money(m.pl)), m.pl < 0 ? 'neg' : m.pl > 0 ? 'pos' : ''],
      ['Balance', maybe(money(m.balance))],
      ['Margin', maybe(money(m.margin))],
      ['Free Margin', maybe(money(m.freeMargin))],
      ['Margin Level', m.marginLevel == null ? '–' : m.marginLevel.toFixed(2) + '%'],
      ['Credit', maybe(money(m.credit))],
      ['Leverage', m.leverage + ':1']
    ];
    const html = (list) => list.map((r) => '<dt>' + r[0] + '</dt><dd class="' + (r[2] || '') + '">' + r[1] + '</dd>').join('');
    $$('[data-stats="full"]').forEach((el) => { el.innerHTML = html(rows); });
    $$('[data-stats="manage"]').forEach((el) => { el.innerHTML = html([['Equity', maybe(money(m.equity)), 'strong']].concat(rows)); });
  }

  function renderPositions() {
    const a = E.active();
    const empty = '<div class="empty">No open positions. Place a mock order from the Markets tab.</div>';
    const rows = a.positions.map((p) => {
      const inst = E.quote(p.symbol).inst;
      return '<div class="prow" data-id="' + p.id + '">' +
        '<div class="pos-main"><b>' + p.symbol + '</b><span class="side ' + p.side + '">' + p.side.toUpperCase() + ' ' + p.lots.toFixed(2) + '</span></div>' +
        '<div class="pos-px"><span class="muted">' + px(p.open, inst.digits) + ' → </span><span data-cur>' + '' + '</span></div>' +
        '<div class="pos-pl" data-pl></div>' +
        '<button class="close-pos" data-close-pos="' + p.id + '" aria-label="Close position">Close</button></div>';
    }).join('');
    $$('[data-positions]').forEach((el) => { el.innerHTML = rows || empty; });
    updatePositionTicks();
  }

  function updatePositionTicks() {
    const a = E.active();
    a.positions.forEach((p) => {
      const q = E.quote(p.symbol);
      const pl = E.positionPL(p);
      $$('.prow[data-id="' + p.id + '"]').forEach((row) => {
        $('[data-cur]', row).textContent = px(p.side === 'buy' ? q.bid : q.ask, q.inst.digits);
        const el = $('[data-pl]', row);
        el.textContent = money(pl, true);
        el.className = 'pos-pl ' + (pl < 0 ? 'neg' : 'pos');
      });
    });
  }

  // ---------- Router ----------
  function route() {
    const view = location.hash.replace('#', '') || 'dashboard';
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
    $$('#tabs a').forEach((a) => a.classList.toggle('active', a.dataset.view === view));
    if (view === 'markets' && chart) chart.resize();
  }

  // ---------- Watchlist ----------
  function symIcon(inst) {
    const [bg, txt] = ICONS[inst.icon];
    return '<span class="sym-ico-inner" style="background:' + bg + '">' + txt + '</span>';
  }

  function renderWatchlist() {
    const group = $('#wlGroup').value;
    const q = $('#wlSearch').value.trim().toLowerCase();
    const list = INSTRUMENTS.filter((i) => (group === 'All' || i.group === group) &&
      (!q || i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)));
    $('#wlList').innerHTML = list.map((i) =>
      '<li><button data-sym="' + i.symbol + '" class="' + (i.symbol === E.state.symbol ? 'active' : '') + '">' +
      symIcon(i) +
      '<span class="wl-name"><b>' + i.symbol + '</b><small>' + i.name + '</small></span>' +
      '<span class="wl-px"><b data-px></b><small data-chg></small></span></button></li>'
    ).join('') || '<li class="empty">No matches</li>';
    tickWatchlist();
  }

  function tickWatchlist() {
    $$('#wlList [data-sym]').forEach((btn) => {
      const q = E.quote(btn.dataset.sym);
      const chg = E.changePct(btn.dataset.sym);
      const pxEl = $('[data-px]', btn);
      pxEl.textContent = px(q.bid, q.inst.digits);
      pxEl.classList.remove('flash-up', 'flash-down');
      if (q.dir) { void pxEl.offsetWidth; pxEl.classList.add(q.dir > 0 ? 'flash-up' : 'flash-down'); }
      const c = $('[data-chg]', btn);
      c.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%';
      c.className = chg >= 0 ? 'pos' : 'neg';
    });
  }

  // ---------- Chart + symbol header ----------
  let chart = null;

  function loadChart() {
    const sym = E.state.symbol;
    const q = E.quote(sym);
    const inst = q.inst;
    $('#symIco').innerHTML = symIcon(inst);
    $('#symName').textContent = sym;
    $$('#tfGroup button').forEach((b) => b.classList.toggle('active', +b.dataset.tf === E.state.tf));
    chart.setData(generateCandles(inst, E.state.tf, 300, q.bid), inst.digits, E.state.tf);
    tickSymbolHeader();
    updateTicket();
  }

  function tickSymbolHeader() {
    const sym = E.state.symbol;
    const q = E.quote(sym);
    const chg = E.changePct(sym);
    const abs = q.bid - q.dayOpen;
    const el = $('#symChange');
    el.textContent = (abs >= 0 ? '+' : '') + px(abs, q.inst.digits) + '  ' + (chg >= 0 ? '↗ +' : '↘ ') + chg.toFixed(2) + '%  · mock feed';
    el.className = 'sym-change ' + (chg >= 0 ? 'pos' : 'neg');
  }

  function showOHLC(c) {
    if (!c) return;
    const d = E.quote(E.state.symbol).inst.digits;
    const diff = c.c - c.o;
    const cls = diff >= 0 ? 'pos' : 'neg';
    $('#ohlc').innerHTML = '<b>' + E.state.symbol + ' · ' + tfLabel() + '</b>' +
      ' O<span class="' + cls + '">' + px(c.o, d) + '</span> H<span class="' + cls + '">' + px(c.h, d) +
      '</span> L<span class="' + cls + '">' + px(c.l, d) + '</span> C<span class="' + cls + '">' + px(c.c, d) +
      '</span> <span class="' + cls + '">' + (diff >= 0 ? '+' : '') + px(diff, d) + ' (' + ((diff / c.o) * 100).toFixed(2) + '%)</span>';
  }
  const tfLabel = () => (TIMEFRAMES.find((t) => t.sec === E.state.tf) || TIMEFRAMES[0]).label;

  // ---------- One-click ticket ----------
  function lots() {
    const v = parseFloat($('#lots').value);
    return Math.max(0.01, Math.round((isNaN(v) ? 0.01 : v) * 100) / 100);
  }

  function updateTicket() {
    const q = E.quote(E.state.symbol);
    const d = q.inst.digits;
    $('#sellPx').textContent = px(q.bid, d);
    $('#buyPx').textContent = px(q.ask, d);
    $('#spread').textContent = px(q.ask - q.bid, d);
    const l = lots();
    $('#ocUnits').textContent = (q.inst.contract * l).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ' + q.inst.unit;
    $('#ocMargin').textContent = money(E.requiredMargin(E.state.symbol, l));
  }

  function placeOrder(side) {
    const res = E.openPosition(E.state.symbol, side, lots());
    if (!res.ok) return toast(res.error, 'err');
    toast('Mock ' + side.toUpperCase() + ' ' + lots().toFixed(2) + ' ' + E.state.symbol + ' @ ' +
      px(res.position.open, E.quote(E.state.symbol).inst.digits), 'ok');
  }

  // ---------- Overlays ----------
  function openOverlay(id, anchor) {
    closeOverlays();
    const el = $('#' + id);
    el.hidden = false;
    $('#scrim').hidden = false;
    if (anchor && id === 'acctPopover' && window.innerWidth > 720) {
      const r = anchor.getBoundingClientRect();
      el.style.top = r.bottom + 8 + 'px';
      el.style.left = Math.max(12, Math.min(r.left, window.innerWidth - el.offsetWidth - 12)) + 'px';
    } else {
      el.style.top = el.style.left = '';
    }
  }
  function closeOverlays() {
    $$('.popover, .modal, .drawer').forEach((el) => { el.hidden = true; });
    $('#scrim').hidden = true;
  }

  function renderAccountList() {
    $('#acctList').innerHTML = E.state.accounts.map((a) => {
      const m = E.metrics(a);
      return '<button class="acct-item ' + (a.id === E.state.activeId ? 'active' : '') + '" data-acct="' + a.id + '">' +
        '<span class="acct-item-name">' + esc(a.name) + '</span>' +
        '<span class="acct-item-bal">' + maybe(money(m.equity)) + '</span>' +
        '<span class="tag ' + (a.type === 'sim' ? 'tag-sim' : 'tag-practice') + '">' + typeText(a) + '</span>' +
        '<span class="acct-item-meta">#' + a.number + ', ' + a.plan + ', ' + a.platform + '</span></button>';
    }).join('');
  }

  // Generic small form modal. fields: [{name,label,type,value,options,min,step}]
  function form(title, fields, submitLabel, onSubmit, note) {
    $('#formTitle').textContent = title;
    const body = fields.map((f) => {
      let input;
      if (f.type === 'select') {
        input = '<select name="' + f.name + '">' + f.options.map((o) =>
          '<option value="' + o.value + '"' + (String(o.value) === String(f.value) ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('') + '</select>';
      } else {
        input = '<input name="' + f.name + '" type="' + (f.type || 'text') + '" value="' + esc(f.value == null ? '' : f.value) + '"' +
          (f.min != null ? ' min="' + f.min + '"' : '') + (f.step ? ' step="' + f.step + '"' : '') + '>';
      }
      return '<label class="field"><span>' + f.label + '</span>' + input + '</label>';
    }).join('');
    $('#formBody').innerHTML = '<form id="theForm">' + body +
      (note ? '<p class="fine">' + note + '</p>' : '') +
      '<p class="form-err" id="formErr"></p>' +
      '<button class="btn primary block" type="submit">' + submitLabel + '</button></form>';
    openOverlay('formModal');
    const input = $('#theForm input, #theForm select');
    if (input) input.focus();
    $('#theForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const err = onSubmit(data);
      if (err) { $('#formErr').textContent = err; return; }
      closeOverlays();
    });
  }

  function info(title, html) {
    $('#formTitle').textContent = title;
    $('#formBody').innerHTML = html;
    openOverlay('formModal');
  }

  const MOCK_NOTE = 'Simulated funds only. This changes local demo data in your browser — no real money moves.';

  const actions = {
    'goto-markets': () => { location.hash = '#markets'; },
    manage: () => openOverlay('manageDrawer'),
    switch: () => { renderAccountList(); openOverlay('selectModal'); },
    deposit: () => form('Mock Deposit', [{ name: 'amount', label: 'Amount (USD)', type: 'number', value: 1000, min: 0, step: '0.01' }], 'Add mock funds', (d) => {
      const r = E.mockFunds('deposit', parseFloat(d.amount));
      if (!r.ok) return r.error; toast('Mock deposit added', 'ok');
    }, MOCK_NOTE),
    withdraw: () => form('Mock Withdrawal', [{ name: 'amount', label: 'Amount (USD)', type: 'number', value: 100, min: 0, step: '0.01' }], 'Remove mock funds', (d) => {
      const r = E.mockFunds('withdraw', parseFloat(d.amount));
      if (!r.ok) return r.error; toast('Mock withdrawal recorded', 'ok');
    }, MOCK_NOTE),
    transfer: () => {
      const others = E.state.accounts.filter((a) => a.id !== E.state.activeId);
      if (!others.length) return toast('Create a second mock account to transfer between.', 'err');
      form('Mock Transfer', [
        { name: 'to', label: 'To account', type: 'select', options: others.map((a) => ({ value: a.id, label: a.name + ' #' + a.number })) },
        { name: 'amount', label: 'Amount (USD)', type: 'number', value: 100, min: 0, step: '0.01' }
      ], 'Transfer mock funds', (d) => {
        const r = E.mockFunds('transfer', parseFloat(d.amount), d.to);
        if (!r.ok) return r.error; toast('Mock transfer complete', 'ok');
      }, MOCK_NOTE);
    },
    create: () => form('Create Mock Account', [
      { name: 'name', label: 'Account name', value: 'New Sim Account' },
      { name: 'type', label: 'Style', type: 'select', value: 'sim', options: [{ value: 'sim', label: 'Simulated (green)' }, { value: 'practice', label: 'Practice (orange)' }] },
      { name: 'balance', label: 'Starting demo balance (USD)', type: 'number', value: 10000, min: 0, step: '0.01' },
      { name: 'leverage', label: 'Leverage', type: 'select', value: 500, options: [50, 100, 200, 500, 1000].map((v) => ({ value: v, label: v + ':1' })) }
    ], 'Create', (d) => {
      const bal = parseFloat(d.balance);
      if (!(bal >= 0)) return 'Enter a valid starting balance.';
      E.createAccount(d.name.trim().slice(0, 40), d.type, bal, +d.leverage);
      toast('Mock account created', 'ok');
    }, 'Creates a fictional account stored only in this browser.'),
    leverage: () => form('Change Leverage', [
      { name: 'leverage', label: 'Leverage', type: 'select', value: E.active().leverage, options: [50, 100, 200, 500, 1000].map((v) => ({ value: v, label: v + ':1' })) }
    ], 'Save', (d) => { E.updateActive({ leverage: +d.leverage }); toast('Leverage updated', 'ok'); }),
    rename: () => form('Change Account Name', [{ name: 'name', label: 'Name', value: E.active().name }], 'Save', (d) => {
      const n = d.name.trim();
      if (!n) return 'Name cannot be empty.';
      E.updateActive({ name: n.slice(0, 40) }); toast('Name updated', 'ok');
    }),
    'login-details': () => {
      const a = E.active();
      info('Sim Login Details', '<dl class="stats"><dt>Login</dt><dd>' + a.number + '</dd><dt>Server</dt><dd>sim-local-01</dd>' +
        '<dt>Platform</dt><dd>' + a.platform + ' (mock)</dd><dt>Password</dt><dd>not applicable</dd></dl>' +
        '<p class="fine">These are placeholder values. This app has no login or server connection.</p>');
    },
    history: () => {
      const a = E.active();
      const rows = a.history.slice(0, 50).map((h) => '<tr><td>' + new Date(h.t).toLocaleString() + '</td><td>' + esc(h.kind) +
        '<small>' + esc(h.note || '') + '</small></td><td class="' + (h.amount < 0 ? 'neg' : 'pos') + '">' + money(h.amount, true) + '</td></tr>').join('');
      info('Transaction History (mock)', '<div class="table-wrap"><table class="hist">' + (rows || '<tr><td>No activity</td></tr>') + '</table></div>');
    },
    reset: () => {
      if (confirm('Reset all mock accounts, positions and history to defaults?')) { E.reset(); renderWatchlist(); loadChart(); toast('Demo data reset', 'ok'); }
    }
  };

  // ---------- Toasts ----------
  function toast(msg, kind) {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2600);
    setTimeout(() => el.remove(), 3000);
  }

  // ---------- Events ----------
  function wire() {
    document.addEventListener('click', (e) => {
      const act = e.target.closest('[data-action]');
      if (act && actions[act.dataset.action]) { e.preventDefault(); actions[act.dataset.action](); return; }
      if (e.target.closest('[data-close]') || e.target.id === 'scrim') { closeOverlays(); return; }
      const acct = e.target.closest('[data-acct]');
      if (acct) { E.update({ activeId: acct.dataset.acct }); closeOverlays(); toast('Switched to ' + E.active().name, 'ok'); return; }
      const closeBtn = e.target.closest('[data-close-pos]');
      if (closeBtn) {
        const pl = E.closePosition(closeBtn.dataset.closePos);
        if (pl != null) toast('Mock position closed: ' + money(pl, true), pl < 0 ? 'err' : 'ok');
        return;
      }
      const sym = e.target.closest('[data-sym]');
      if (sym) { E.update({ symbol: sym.dataset.sym }); renderWatchlist(); loadChart(); }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOverlays(); });

    $('#acctChip').addEventListener('click', (e) => openOverlay('acctPopover', e.currentTarget));
    $('#acctSelectBtn').addEventListener('click', actions.switch);
    $('#createBtn').addEventListener('click', actions.create);
    $('#eyeBtn').addEventListener('click', () => E.update({ hideBalance: !E.state.hideBalance }));
    $('#copyBtn').addEventListener('click', () => {
      const n = E.active().number;
      (navigator.clipboard ? navigator.clipboard.writeText(n) : Promise.reject()).then(() => toast('Copied ' + n, 'ok'), () => toast(n));
    });

    $('#wlGroup').innerHTML = ['All'].concat([...new Set(INSTRUMENTS.map((i) => i.group))]).map((g) => '<option>' + g + '</option>').join('');
    $('#wlGroup').addEventListener('change', renderWatchlist);
    $('#wlSearch').addEventListener('input', renderWatchlist);

    $('#tfGroup').innerHTML = TIMEFRAMES.map((t) => '<button data-tf="' + t.sec + '">' + t.label + '</button>').join('');
    $('#tfGroup').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tf]');
      if (b) { E.update({ tf: +b.dataset.tf }); loadChart(); }
    });

    $('#sellBtn').addEventListener('click', () => placeOrder('sell'));
    $('#buyBtn').addEventListener('click', () => placeOrder('buy'));
    const step = (d) => { $('#lots').value = Math.max(0.01, lots() + d).toFixed(2); updateTicket(); };
    $('#lotMinus').addEventListener('click', () => step(-0.01));
    $('#lotPlus').addEventListener('click', () => step(0.01));
    $('#lots').addEventListener('input', updateTicket);
    $('#lots').addEventListener('blur', () => { $('#lots').value = lots().toFixed(2); updateTicket(); });

    window.addEventListener('hashchange', route);
  }

  function renderAll() {
    renderAccount();
    renderPositions();
    if (!$('#selectModal').hidden) renderAccountList();
  }

  function init() {
    wire();
    chart = new SIM.CandleChart($('#chart'), { onHover: showOHLC });
    renderWatchlist();
    loadChart();
    renderAll();
    route();

    E.on('change', renderAll);
    E.on('tick', () => {
      tickWatchlist();
      tickSymbolHeader();
      updateTicket();
      chart.pushPrice(E.quote(E.state.symbol).bid);
      renderAccount();
      updatePositionTicks();
      $('#clock').textContent = new Date().toLocaleTimeString() + ' local';
    });
    E.start();
    E.log('ready');
  }

  document.addEventListener('DOMContentLoaded', init);
})(window.SIM = window.SIM || {});
