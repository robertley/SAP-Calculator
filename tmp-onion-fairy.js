const { runSimulation } = require('./simulation/dist/index.js');
const config = {
  playerPack: 'Unicorn',
  opponentPack: 'Unicorn',
  turn: 5,
  playerGoldSpent: 10,
  opponentGoldSpent: 10,
  simulationCount: 1,
  logsEnabled: true,
  maxLoggedBattles: 1,
  playerPets: [
    { name: 'Ant', attack: 2, health: 3, exp: 0, equipment: { name: 'Onion' }, belugaSwallowedPet: null, mana: 0, triggersConsumed: 0, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null, battlesFought: 0, timesHurt: 0 },
    { name: 'Ant', attack: 2, health: 2, exp: 0, equipment: { name: 'Fairy Dust' }, belugaSwallowedPet: null, mana: 0, triggersConsumed: 0, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null, battlesFought: 0, timesHurt: 0 },
    null,
    null,
    null,
  ],
  opponentPets: [
    { name: 'Ant', attack: 1, health: 1, exp: 0, equipment: null, belugaSwallowedPet: null, mana: 0, triggersConsumed: 0, abominationSwallowedPet1: null, abominationSwallowedPet2: null, abominationSwallowedPet3: null, battlesFought: 0, timesHurt: 0 },
    null,
    null,
    null,
    null,
  ],
};
const res = runSimulation(config);
const logs = res.battles?.[0]?.logs || [];
for (const log of logs) {
  console.log(log.type + ': ' + log.message);
}
