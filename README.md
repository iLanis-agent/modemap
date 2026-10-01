# ModeMap

Room mode (bass resonance) map for a rectangular room.

- f = (c/2) sqrt((p/L)^2 + (q/W)^2 + (r/H)^2); one nonzero index is axial, two tangential, three oblique
- c = 331.3 + 0.606 x C m/s
- Schroeder frequency = 2000 sqrt(RT60 / V), V in m3
- Stacked axial modes (within 5%) and equal dimensions are flagged (heuristic)

Empty rigid-wall idealisation; real rooms differ. Planning aid, not a measurement.

Static client-side. `node test-engine.js` runs the tests.
Sources: http://www.vibrationdata.com/tutorials_alt/aco_rec.pdf , https://en.wikipedia.org/wiki/Schroeder_frequency , https://odeon.dk/pdf/A29-JASA-EL-021601_1_Rindel.pdf
