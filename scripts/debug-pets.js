
const fs = require('fs');
const path = require('path');

const petsPath = path.join('c:', 'Dev', 'SAP-Calculator', 'src', 'assets', 'data', 'pets.json');
const petsData = JSON.parse(fs.readFileSync(petsPath, 'utf8'));

console.log('Total pets:', petsData.length);

const pet25 = petsData.find(p => String(p.Id) === '25');
console.log('Pet with Id 25:', pet25 ? { Id: pet25.Id, Name: pet25.Name } : 'Not found');

const ant = petsData.find(p => p.Name === 'Ant');
console.log('Ant:', ant ? { Id: ant.Id, Name: ant.Name } : 'Not found');

const brainCramp = petsData.find(p => p.Name === 'Brain Cramp');
console.log('Brain Cramp:', brainCramp ? { Id: brainCramp.Id, Name: brainCramp.Name } : 'Not found');

const sampleIds = petsData.slice(0, 5).map(p => ({ Id: p.Id, Name: p.Name }));
console.log('Sample IDs:', sampleIds);
