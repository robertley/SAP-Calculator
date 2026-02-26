
const fs = require('fs');
const path = require('path');

const responsePath = path.join('c:', 'Dev', 'SAP-Calculator', 'tmp', 'simulated-import-response.json');
const data = JSON.parse(fs.readFileSync(responsePath, 'utf8'));

const turn12 = data.turns.find(a => (a.Turn === 12 || a.turn === 12));
if (turn12 && turn12.playerPets) {
    console.log('Turn 12 Player Pet 0:', JSON.stringify(turn12.playerPets[0], null, 2));
} else {
    console.log('Turn 12 or playerPets not found');
}
