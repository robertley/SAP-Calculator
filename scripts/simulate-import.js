const fs = require('fs');

async function simulateImport() {
    const baseUrl = 'https://sap-library.vercel.app';
    const pid = 'a91f3f74-3c0b-4b47-97e8-1a9e466950b3';
    const turn = 12;

    try {
        console.log(`1. Requesting replay index for PID: ${pid}`);
        const indexResponse = await fetch(`${baseUrl}/api/replays`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participationId: pid })
        });

        if (!indexResponse.ok) {
            throw new Error(`Failed to index replay: ${indexResponse.statusText}`);
        }

        const indexData = await indexResponse.json();
        const replayId = indexData.replayId;
        console.log(`2. Received Replay ID: ${replayId}`);

        console.log(`3. Fetching full turns data for ID: ${replayId}`);
        const turnsResponse = await fetch(`${baseUrl}/api/replays/${replayId}/turns`);

        if (!turnsResponse.ok) {
            throw new Error(`Failed to fetch turns: ${turnsResponse.statusText}`);
        }

        const turnsData = await turnsResponse.json();
        const outputPath = 'c:/Dev/SAP-Calculator/tmp/simulated-import-response.json';
        fs.writeFileSync(outputPath, JSON.stringify(turnsData, null, 2));

        console.log(`4. Successfully saved library response to ${outputPath}`);

        // Find Turn 12
        const turn12 = turnsData.turns.find(t => t.turnNumber === turn || t.turn === turn);
        if (turn12) {
            console.log(`\n--- Turn ${turn} Overview ---`);
            console.log(`Player Gold Spent: ${turn12.playerGoldSpent}`);
            console.log(`Player Summons: ${turn12.playerSummons}`);
            console.log(`Pets (Player): ${turn12.pets?.player?.length ?? 0}`);
            console.log(`Pets (Opponent): ${turn12.pets?.opponent?.length ?? 0}`);

            const abomination = turn12.pets?.player?.find(p => p.petName === 'Abomination');
            if (abomination) {
                console.log(`\nFound Abomination on Turn ${turn}!`);
                console.log(`Abilities: ${JSON.stringify(abomination.abilities, null, 2)}`);
            }
        }
    } catch (error) {
        console.error('Error during simulated import:', error);
    }
}

simulateImport();
