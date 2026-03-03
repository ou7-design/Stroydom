const fs = require('fs');

const file = 'c:/Users/mamur/Downloads/bloomava-clone/src/App.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const linesToRemove = new Set([
  ...Array.from({length: 116 - 57 + 1}, (_, i) => 57 + i),
  ...Array.from({length: 388 - 250 + 1}, (_, i) => 250 + i),
  ...Array.from({length: 427 - 421 + 1}, (_, i) => 421 + i),
  491,
  494
]);

const newLines = lines.filter((_, idx) => !linesToRemove.has(idx + 1));
fs.writeFileSync(file, newLines.join('\n'));
console.log('Done');
