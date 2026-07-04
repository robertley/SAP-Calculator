import { describe, expect, it } from 'vitest';
import {
  createBaseConfig,
  createPet,
  runBattleLogs,
} from '../../support/battle-test-runtime';

const CUSTOM_PACK_NAME = 'froggingintherain';

function createReportedCustomPackConfig() {
  const config = createBaseConfig('Custom');
  config.playerPack = CUSTOM_PACK_NAME;
  config.opponentPack = CUSTOM_PACK_NAME;
  config.turn = 10;
  config.logsEnabled = true;
  config.maxLoggedBattles = 1;
  config.customPacks = [
    {
      name: CUSTOM_PACK_NAME,
      tier1Pets: [
        'Iriomote Cat',
        'Ili Pika',
        'Ant',
        'Pig',
        'Chinchilla',
        'Duckling',
        'Bluebird',
        'Quoll',
        'Barghest',
        'Groundhog',
      ],
      tier2Pets: [
        'Araripe Manakin',
        'Proboscis Monkey',
        'Desert Rain Frog',
        'Flamingo',
        'Dromedary',
        'African Penguin',
        'Albino Squirrel',
        'Lemur',
        'Swan',
        'Ogopogo',
      ],
      tier3Pets: [
        'Blue-Throated Macaw',
        'Rabbit',
        'Flying Squirrel',
        'Gharial',
        'Dolphin',
        'Giraffe',
        'Betta Fish',
        'Brain Cramp',
        'Quail Chick',
        'Anteater',
      ],
      tier4Pets: [
        'Poodle Moth',
        'Gelada',
        'Deer',
        'Penguin',
        'Puppy',
        'Crow',
        'Manatee',
        'Farmer Cat',
        'Turtle',
        'Skunk',
      ],
      tier5Pets: [
        'Giant Pangasius',
        'Monkey',
        'Cow',
        'Sting Ray',
        'Blue Ringed Octopus',
        'Bad Dog',
        'Flounder',
        'Moose',
        'Banggai Cardinalfish',
        'Marine Iguana',
      ],
      tier6Pets: [
        'Hooded Seal',
        'California Condor',
        'Cat',
        'Tiger',
        'Oyster',
        'Helmeted Hornbill',
        'Quetzalcoatl',
        'Team Spirit',
        'Yeti',
        'Puma',
      ],
      spells: [],
    },
  ];
  config.playerPets[0] = createPet('Desert Rain Frog', {
    attack: 2,
    health: 50,
    equipment: { name: 'Cherry' },
  });
  config.playerPets[1] = createPet('Bluebird', {
    attack: 2,
    health: 1,
  });
  config.opponentPets[0] = createPet('Behemoth', {
    attack: 12,
    health: 100,
  });
  return config;
}

describe('Desert Rain Frog custom pack regression', () => {
  it('transforms into a faint pet from the selected custom pack tier', () => {
    const logs = runBattleLogs(createReportedCustomPackConfig());
    const messages = logs.map((log) => String(log.message ?? ''));

    expect(messages).toContain('Desert Rain Frog transformed into Anteater.');
    expect(
      messages.filter((message) =>
        message.startsWith('Desert Rain Frog transformed into '),
      ),
    ).toEqual(['Desert Rain Frog transformed into Anteater.']);
  });

  it('uses the Tiger repeat after the original frog transforms', () => {
    const config = createReportedCustomPackConfig();
    config.playerPets[1] = createPet('Tiger', {
      attack: 6,
      health: 4,
      exp: 5,
      equipment: { name: 'Cherry' },
    });

    const logs = runBattleLogs(config);
    const transformMessages = logs
      .map((log) => String(log.message ?? ''))
      .filter((message) =>
        message.startsWith('Desert Rain Frog transformed into '),
      );

    expect(transformMessages).toEqual([
      'Desert Rain Frog transformed into Anteater.',
      'Desert Rain Frog transformed into Giant Pangasius. (Tiger)',
    ]);
  });
});
