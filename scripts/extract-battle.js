const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Dev/SAP-Calculator/tmp/replay-participation-full.json', 'utf8'));

const lastAction = data.Actions.find(a => a.Type === 0 && a.Battle); // Look for Type 0 which has Build/Battle
if (lastAction && lastAction.Battle) {
    const battle = JSON.parse(lastAction.Battle);
    fs.writeFileSync('c:/Dev/SAP-Calculator/tmp/battle-pretty.json', JSON.stringify(battle, null, 2));
    console.log("Saved pretty battle to tmp/battle-pretty.json");
} else {
    // Try any action with battle
    const anyBattle = data.Actions.reverse().find(a => a.Battle);
    if (anyBattle) {
        const battle = JSON.parse(anyBattle.Battle);
        fs.writeFileSync('c:/Dev/SAP-Calculator/tmp/battle-pretty.json', JSON.stringify(battle, null, 2));
        console.log("Saved pretty battle (from some action) to tmp/battle-pretty.json");
    } else {
        console.log("No battle data found in any action");
    }
}
