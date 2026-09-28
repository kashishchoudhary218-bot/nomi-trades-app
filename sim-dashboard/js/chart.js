/*
 * chart.js — lightweight canvas candlestick chart (TradingView-style look).
 * Draws mock candles only. Supports resize, wheel zoom, crosshair and
 * live updating of the last candle.
 */
(function (SIM) {
  'use strict';

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function CandleChart(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onHover = opts.onHover || function () {};
    this.candles = [];
    this.digits = 2;
    this.tf = 60;
    this.visible = 90;
    this.hoverX = null;
    this.hoverY = null;

    const ro = new ResizeObserver(() => this.resize());
    ro.observe(canvas.parentElement);

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      this.hoverX = e.clientX - r.left; this.hoverY = e.clientY - r.top;
      this.draw();
    });
    canvas.addEventListener('mouseleave', () => { this.hoverX = this.hoverY = null; this.onHover(null); this.draw(); });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.visible = Math.max(20, Math.min(this.candles.length, Math.round(this.visible * (e.deltaY > 0 ? 1.12 : 0.89))));
      this.draw();
    }, { passive: false });
  }

  CandleChart.prototype.resize = function () {
    const p = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    this.w = p.clientWidth; this.h = p.clientHeight;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px'; this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  };

  CandleChart.prototype.setData = function (candles, digits, tf) {
    this.candles = candles; this.digits = digits; this.tf = tf;
    this.visible = Math.min(this.visible, candles.length);
    this.draw();
  };

  // Feed a live price into the last candle, rolling a new bucket when needed.
  CandleChart.prototype.pushPrice = function (price) {
    if (!this.candles.length) return;
    const now = Math.floor(Date.now() / 1000);
    const bucket = now - (now % this.tf);
    let last = this.candles[this.candles.length - 1];
    if (bucket > last.t) {
      last = { t: bucket, o: last.c, h: Math.max(last.c, price), l: Math.min(last.c, price), c: price };
      this.candles.push(last);
      if (this.candles.length > 600) this.candles.shift();
    } else {
      last.c = price; last.h = Math.max(last.h, price); last.l = Math.min(last.l, price);
    }
    this.draw();
  };

  function fmtTime(t, tf) {
    const d = new Date(t * 1000);
    if (tf >= 86400) return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  CandleChart.prototype.draw = function () {
    const { ctx, w, h } = this;
    if (!w || !h || !this.candles.length) return;
    const axisW = 72, axisH = 26;
    const plotW = w - axisW, plotH = h - axisH;
    const up = css('--up'), down = css('--down'), grid = css('--chart-grid'),
      text = css('--text-3'), line = css('--border');

    ctx.clearRect(0, 0, w, h);

    const data = this.candles.slice(-this.visible);
    let hi = -Infinity, lo = Infinity;
    data.forEach((c) => { if (c.h > hi) hi = c.h; if (c.l < lo) lo = c.l; });
    const pad = (hi - lo) * 0.08 || 1;
    hi += pad; lo -= pad;
    const y = (p) => ((hi - p) / (hi - lo)) * plotH;
    const slot = plotW / (data.length + 3);
    const x = (i) => slot * (i + 0.5);

    // Watermark
    ctx.save();
    ctx.fillStyle = css('--watermark');
    ctx.font = '700 ' + Math.max(18, Math.min(44, plotW / 16)) + 'px Poppins, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SIMULATION — DEMO DATA', plotW / 2, plotH / 2);
    ctx.restore();

    // Grid + price axis labels
    ctx.font = '11px Poppins, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const steps = Math.max(4, Math.floor(plotH / 44));
    for (let i = 0; i <= steps; i++) {
      const p = lo + ((hi - lo) * i) / steps;
      const yy = Math.round(y(p)) + 0.5;
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(plotW, yy); ctx.stroke();
      ctx.fillStyle = text; ctx.textAlign = 'left';
      ctx.fillText(p.toLocaleString(undefined, { minimumFractionDigits: this.digits, maximumFractionDigits: this.digits }), plotW + 8, yy);
    }

    // Time axis
    const every = Math.max(1, Math.ceil(90 / slot));
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    data.forEach((c, i) => {
      if (i % every) return;
      const xx = Math.round(x(i)) + 0.5;
      ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(xx, 0); ctx.lineTo(xx, plotH); ctx.stroke();
      ctx.fillStyle = text; ctx.fillText(fmtTime(c.t, this.tf), xx, h - 8);
    });

    ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(plotW + 0.5, 0); ctx.lineTo(plotW + 0.5, plotH); ctx.lineTo(0, plotH + 0.5); ctx.stroke();

    // Candles
    const bw = Math.max(1, slot * 0.68);
    data.forEach((c, i) => {
      const col = c.c >= c.o ? up : down;
      const xx = x(i);
      ctx.strokeStyle = col; ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(Math.round(xx) + 0.5, y(c.h)); ctx.lineTo(Math.round(xx) + 0.5, y(c.l)); ctx.stroke();
      const top = y(Math.max(c.o, c.c)), bot = y(Math.min(c.o, c.c));
      ctx.fillRect(xx - bw / 2, top, bw, Math.max(1, bot - top));
    });

    // Last price line + tag
    const last = data[data.length - 1];
    const ly = Math.round(y(last.c)) + 0.5;
    const lcol = last.c >= last.o ? up : down;
    ctx.setLineDash([4, 4]); ctx.strokeStyle = lcol;
    ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(plotW, ly); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = lcol; ctx.fillRect(plotW + 1, ly - 10, axisW - 2, 20);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(last.c.toFixed(this.digits), plotW + 6, ly);

    // Crosshair
    let hovered = null;
    if (this.hoverX != null && this.hoverX < plotW && this.hoverY < plotH) {
      const idx = Math.min(data.length - 1, Math.max(0, Math.floor(this.hoverX / slot)));
      hovered = data[idx];
      const cx = Math.round(x(idx)) + 0.5, cy = Math.round(this.hoverY) + 0.5;
      ctx.setLineDash([3, 3]); ctx.strokeStyle = text;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, plotH); ctx.moveTo(0, cy); ctx.lineTo(plotW, cy); ctx.stroke();
      ctx.setLineDash([]);
      const hp = hi - (this.hoverY / plotH) * (hi - lo);
      ctx.fillStyle = css('--text-1'); ctx.fillRect(plotW + 1, cy - 10, axisW - 2, 20);
      ctx.fillStyle = css('--surface'); ctx.fillText(hp.toFixed(this.digits), plotW + 6, cy);
      const label = fmtTime(hovered.t, this.tf);
      ctx.fillStyle = css('--text-1'); ctx.fillRect(cx - 30, plotH + 2, 60, 20);
      ctx.fillStyle = css('--surface'); ctx.textAlign = 'center'; ctx.fillText(label, cx, plotH + 12);
    }
    this.onHover(hovered || last);
  };

  SIM.CandleChart = CandleChart;
})(window.SIM = window.SIM || {});
