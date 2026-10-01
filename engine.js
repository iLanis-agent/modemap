(function (root) {
  'use strict';
  var FT_PER_M = 3.28084;
  function soundMs(tC) { return 331.3 + 0.606 * tC; }
  // Rectangular room natural frequencies: f = (c/2) sqrt((p/L)^2 + (q/W)^2 + (r/H)^2), p,q,r = 0,1,2,... not all zero
  function modeFreq(p, q, r, L, W, H, c) { return (c / 2) * Math.sqrt(Math.pow(p / L, 2) + Math.pow(q / W, 2) + Math.pow(r / H, 2)); }
  function kind(p, q, r) { var n = (p > 0) + (q > 0) + (r > 0); return n === 1 ? 'axial' : n === 2 ? 'tangential' : 'oblique'; }
  // All modes up to fmax, sorted. Modes within 0.05 Hz are merged (degenerate) and counted.
  function modes(L, W, H, c, fmax) {
    var out = [], pm = Math.ceil(2 * L * fmax / c), qm = Math.ceil(2 * W * fmax / c), rm = Math.ceil(2 * H * fmax / c);
    for (var p = 0; p <= pm; p++) for (var q = 0; q <= qm; q++) for (var r = 0; r <= rm; r++) {
      if (!p && !q && !r) continue;
      var f = modeFreq(p, q, r, L, W, H, c); if (f > fmax) continue;
      out.push({ f: f, p: p, q: q, r: r, kind: kind(p, q, r), count: 1 });
    }
    out.sort(function (a, b) { return a.f - b.f || (a.kind === b.kind ? 0 : a.kind === 'axial' ? -1 : 1); });
    var merged = [];
    out.forEach(function (m) {
      var last = merged[merged.length - 1];
      if (last && Math.abs(last.f - m.f) < 0.05) { last.count++; last.kind = rank(m.kind) < rank(last.kind) ? m.kind : last.kind; last.label += ' ' + m.p + m.q + m.r; } else { m.label = m.p + '' + m.q + m.r; merged.push(m); }
    });
    return merged;
  }
  function rank(k) { return k === 'axial' ? 0 : k === 'tangential' ? 1 : 2; }
  // Axial mode pairs closer than tol (fraction of frequency) pile up and make uneven bass. Heuristic.
  function stacked(L, W, H, c, fmax, tol) {
    tol = tol == null ? 0.05 : tol; var ax = modes(L, W, H, c, fmax).filter(function (m) { return m.kind === 'axial'; }), res = [];
    for (var i = 1; i < ax.length; i++) if ((ax[i].f - ax[i - 1].f) / ax[i - 1].f < tol) res.push([ax[i - 1], ax[i]]);
    return res;
  }
  // Schroeder frequency (Hz), RT60 in s, V in m3: above this the room modes are dense enough to behave statistically
  function schroeder(rt60, V) { return 2000 * Math.sqrt(rt60 / V); }
  function toM(v, unit) { return unit === 'ft' ? v / FT_PER_M : v; }
  var api = { FT_PER_M: FT_PER_M, soundMs: soundMs, modeFreq: modeFreq, kind: kind, modes: modes, stacked: stacked, schroeder: schroeder, toM: toM };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Modes = api;
})(typeof window !== 'undefined' ? window : this);
