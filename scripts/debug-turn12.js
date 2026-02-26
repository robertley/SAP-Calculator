
const fs = require('fs');
const path = require('path');

const responsePath = path.join('c:', 'Dev', 'SAP-Calculator', 'tmp', 'simulated-import-response.json');
const data = JSON.parse(fs.readFileSync(responsePath, 'utf8'));

const turn12Actions = data.turns.filter(a => (a.Turn === 12 || a.turn === 12));
console.log('Turn 12 actions:', turn12Actions.length);

turn12Actions.forEach((action, i) => {
    console.log(`Action ${i} playerPets:`, action.playerPets.map(p => p ? p.name : null));
    console.log(`Action ${i} opponentPets:`, action.opponentPets.map(p => p ? p.name : null));
    if (action.Build) {
        try {
            const b = JSON.parse(action.Build);
            const items = b.Bor?.Mins?.Items || b.Mins?.Items || [];
            console.log(`  Build items:`, items.length);
            items.forEach((p, j) => {
                if (p) console.log(`    Pet ${j}: Enu ${p.Enu}, At ${p.At?.Perm}, Hp ${p.Hp?.Perm}`);
            });
        } catch (e) { }
    }
    if (action.Battle) {
        try {
            const b = JSON.parse(action.Battle);
            const userItems = b.UserBoard?.Mins?.Items || [];
            const oppItems = b.OpponentBoard?.Mins?.Items || [];
            console.log(`  Battle items: User ${userItems.length}, Opp ${oppItems.length}`);
        } catch (e) { }
    }
    if (action.Mode) {
        try {
            const m = JSON.parse(action.Mode);
            if (m.Opponents) {
                console.log(`  Mode Opponents:`, m.Opponents.length);
                m.Opponents.forEach((opp, j) => {
                    const items = opp.Minions || [];
                    console.log(`    Opponent ${j} items:`, items.length);
                    items.forEach((p, k) => {
                        if (p) console.log(`      Pet ${k}: Enu ${p.Enu}, At ${p.At?.Perm}, Hp ${p.Hp?.Perm}`);
                    });
                });
            }
        } catch (e) { }
    }
});
