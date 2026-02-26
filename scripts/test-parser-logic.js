
const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('tmp/simulated-import-response.json', 'utf8'));
const turn12Action = rawData.replay.raw_json.Actions.find(a => a.Turn === 12 && a.Type === 0);

if (!turn12Action) {
    console.error("Turn 12 Build action not found");
    process.exit(1);
}

const buildJson = JSON.parse(turn12Action.Build);
const userBoard = buildJson.Bor;

console.log("UserBoard found. Pets count in Items:", userBoard.Mins.Items.length);

function toFiniteNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

const parseBoardPets = (boardJson) => {
    // Logic from ReplayCalcParser.parseBoardPets
    const items = boardJson?.Mins?.Items ?? [];
    const pets = items.filter(
        (pet) => pet !== null,
    );
    const petArray = Array(5).fill(null);

    console.log("Filtered pets (excluding nulls):", pets.length);

    pets.forEach((pet, index) => {
        let pos = toFiniteNumber(pet.Poi?.x, null);
        if (pos === null) {
            pos = index;
        }
        console.log(`Processing pet Enu ${pet.Enu} at original array index ${items.indexOf(pet)}. Inferred pos: ${pos}`);
        if (pos >= 0 && pos < 5) {
            petArray[pos] = pet;
        }
    });

    return petArray.reverse();
};

const result = parseBoardPets(userBoard);
console.log("Resulting pet IDs in Array (reversed for UI):", result.map(p => p ? p.Enu : 'null'));
