const which = process.argv.slice(2);
const decks = { 1: ['./demo1', 'out/Demo-01_Electric-Potential.pptx'], 2: ['./demo2', 'out/Demo-02_Ohms-Law.pptx'], 3: ['./demo3', 'out/Demo-03_Resistance-Resistivity.pptx'] };
(async () => { for (const k of (which.length ? which : Object.keys(decks))) { await require(decks[k][0])(decks[k][1]); console.log('wrote', decks[k][1]); } })();
