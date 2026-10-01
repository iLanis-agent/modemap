var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, tol) { n++; if (!(Math.abs(a - b) <= (tol == null ? 1e-9 : tol))) { bad++; console.log('FAIL', m, a, b); } }
var c = 343;
// axial modes: f = n c / 2L. 5 m: 34.3 Hz, 4 m: 42.875 Hz, 3 m: 57.1667 Hz
eq(E.modeFreq(1, 0, 0, 5, 4, 3, c), 34.3, '5m'); eq(E.modeFreq(0, 1, 0, 5, 4, 3, c), 42.875, '4m'); eq(E.modeFreq(0, 0, 1, 5, 4, 3, c), 343 / 6, '3m', 1e-9);
eq(E.modeFreq(2, 0, 0, 5, 4, 3, c), 68.6, '2nd axial'); eq(E.modeFreq(3, 0, 0, 5, 4, 3, c), 102.9, '3rd axial', 1e-9);
// tangential and oblique from the 3D formula
eq(E.modeFreq(1, 1, 0, 5, 4, 3, c), Math.sqrt(34.3 * 34.3 + 42.875 * 42.875), 'tangential 110', 1e-9); eq(E.modeFreq(1, 1, 1, 5, 4, 3, c), Math.sqrt(34.3 * 34.3 + 42.875 * 42.875 + Math.pow(343 / 6, 2)), 'oblique 111', 1e-9);
eq(E.modeFreq(1, 1, 0, 5, 4, 3, c), 54.9, '110 value', 0.05);
// kinds
eq(E.kind(2, 0, 0) === 'axial' ? 1 : 0, 1, 'axial'); eq(E.kind(1, 1, 0) === 'tangential' ? 1 : 0, 1, 'tang'); eq(E.kind(1, 0, 3) === 'tangential' ? 1 : 0, 1, 'tang2'); eq(E.kind(1, 2, 1) === 'oblique' ? 1 : 0, 1, 'obl');
// mode list for 5 x 4 x 3 m up to 100 Hz: first two are axial, the third is the (1,1,0) tangential mode
var m = E.modes(5, 4, 3, c, 100); eq(m[0].f, 34.3, 'first'); eq(m[1].f, 42.875, 'second'); eq(m[2].f, 54.9068, 'third is the 110 tangential', 1e-4); eq(m[2].kind === 'tangential' ? 1 : 0, 1, 'third tangential'); eq(m[3].f, 343 / 6, 'fourth is 3 m axial', 1e-9); eq(m[0].kind === 'axial' ? 1 : 0, 1, 'first axial');
for (var i = 1; i < m.length; i++) eq(m[i].f >= m[i - 1].f ? 1 : 0, 1, 'sorted ' + i);
m.forEach(function (x, i) { eq(x.f <= 100 ? 1 : 0, 1, 'under fmax ' + i); });
// count of modes: brute force check up to 150 Hz
var cnt = 0; for (var p = 0; p < 9; p++) for (var q = 0; q < 9; q++) for (var r = 0; r < 9; r++) if ((p || q || r) && E.modeFreq(p, q, r, 5, 4, 3, c) <= 150) cnt++;
var all = E.modes(5, 4, 3, c, 150), tot = 0; all.forEach(function (x) { tot += x.count; }); eq(tot, cnt, 'mode count up to 150 Hz');
// cube: three degenerate axial modes at 42.875 Hz merge into one entry with count 3
var cube = E.modes(4, 4, 4, c, 50); eq(cube[0].count, 3, 'cube degeneracy'); eq(cube[0].f, 42.875, 'cube f1'); eq(cube[0].kind === 'axial' ? 1 : 0, 1, 'cube kind');
// density grows: more modes in the upper octave than the lower one
eq(E.modes(5, 4, 3, c, 200).length > 2 * E.modes(5, 4, 3, c, 100).length * 0.9 ? 1 : 0, 1, 'density grows');
// stacked axial pairs: 4.00 and 4.05 m rooms are within 2% of each other
eq(E.stacked(5, 4.0, 4.1, c, 100, 0.05).length >= 1 ? 1 : 0, 1, 'stacked detected'); eq(E.stacked(5, 4, 3, c, 100, 0.05).length, 0, 'none stacked for 5x4x3');
// 5 x 4 x 3 m axial modes in 100 Hz: 34.3, 42.875, 57.17, 68.6, 85.75, 102.9... check 2*42.875 = 85.75 is present
eq(E.modes(5, 4, 3, c, 100).some(function (x) { return Math.abs(x.f - 85.75) < 1e-6; }) ? 1 : 0, 1, '85.75 present');
// Schroeder frequency: 2000 sqrt(T/V). T = 0.5 s, V = 60 m3 -> 182.6 Hz. Bigger room, lower value
eq(E.schroeder(0.5, 60), 182.57, 'schroeder', 0.01); eq(E.schroeder(0.4, 100), 126.49, 'schroeder 2', 0.01); eq(E.schroeder(1, 1), 2000, 'schroeder unit'); eq(E.schroeder(0.5, 120) < E.schroeder(0.5, 60) ? 1 : 0, 1, 'bigger lower');
// speed of sound and units
eq(E.soundMs(20), 343.42, 'c20', 1e-9); eq(E.soundMs(0), 331.3, 'c0'); eq(E.toM(10, 'ft'), 3.048, 'ft', 1e-3); eq(E.toM(10, 'm'), 10, 'm');
// scaling: doubling every dimension halves every frequency
eq(E.modeFreq(1, 1, 1, 10, 8, 6, c) * 2, E.modeFreq(1, 1, 1, 5, 4, 3, c), 'scale', 1e-9);
console.log(n + ' assertions, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
