import * as perks from 'assets/data/perks.json';
import * as toys from 'assets/data/toys.json';
import * as petsByTier from 'assets/data/pets.json';

export const PETS_BY_ID = new Map<string, string>();
export const PETS_META_BY_ID = new Map<
  string,
  { name: string; tier: number }
>();

const petList =
  (
    petsByTier as unknown as {
      default?: Array<{ Id: string; Name: string; Tier: string | number }>;
    }
  ).default ??
  (petsByTier as unknown as Array<{
    Id: string;
    Name: string;
    Tier: string | number;
  }>);

petList.forEach((pet) => {
  const petId = String(pet.Id);
  const tierValue = Number(pet.Tier);
  PETS_BY_ID.set(petId, pet.Name);
  if (Number.isFinite(tierValue)) {
    PETS_META_BY_ID.set(petId, { name: pet.Name, tier: tierValue });
  }
});

const perkList =
  (perks as unknown as { default?: Array<{ Id: string; Name: string }> })
    .default ?? (perks as unknown as Array<{ Id: string; Name: string }>);
const toyList =
  (toys as unknown as { default?: Array<{ Id: string; Name: string }> })
    .default ?? (toys as unknown as Array<{ Id: string; Name: string }>);

export const PERKS_BY_ID = new Map<string, string>(
  perkList.map((perk) => [String(perk.Id), perk.Name]),
);
export const TOYS_BY_ID = new Map<string, string>(
  toyList.map((toy) => [String(toy.Id), toy.Name]),
);

export const PACK_MAP: Record<number, string> = {
  0: 'Turtle',
  1: 'Puppy',
  2: 'Star',
  5: 'Golden',
  6: 'Unicorn',
  7: 'Danger',
};

const PARROT_COPY_PET_ABOMINATION_KEY_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (let outer = 1; outer <= 3; outer++) {
    const base = `parrotCopyPetAbominationSwallowedPet${outer}`;
    const outerPrefix = `pCPAS${outer}`;
    map[base] = outerPrefix;
    map[`${base}BelugaSwallowedPet`] = `${outerPrefix}B`;
    map[`${base}Level`] = `${outerPrefix}L`;
    map[`${base}TimesHurt`] = `${outerPrefix}T`;
    map[`${base}ParrotCopyPet`] = `${outerPrefix}PCP`;
    map[`${base}ParrotCopyPetBelugaSwallowedPet`] = `${outerPrefix}PCPB`;
    for (let inner = 1; inner <= 3; inner++) {
      const innerBase = `${base}ParrotCopyPetAbominationSwallowedPet${inner}`;
      const innerPrefix = `${outerPrefix}PCPAS${inner}`;
      map[innerBase] = innerPrefix;
      map[`${innerBase}BelugaSwallowedPet`] = `${innerPrefix}B`;
      map[`${innerBase}Level`] = `${innerPrefix}L`;
      map[`${innerBase}TimesHurt`] = `${innerPrefix}T`;
    }
  }
  return map;
})();

export const KEY_MAP: Record<string, string> = {
  playerPack: 'pP',
  opponentPack: 'oP',
  playerToy: 'pT',
  playerToyLevel: 'pTL',
  playerHardToy: 'pHT',
  playerHardToyLevel: 'pHTL',
  opponentToy: 'oT',
  opponentToyLevel: 'oTL',
  opponentHardToy: 'oHT',
  opponentHardToyLevel: 'oHTL',
  turn: 't',
  playerGoldSpent: 'pGS',
  opponentGoldSpent: 'oGS',
  playerRollAmount: 'pRA',
  opponentRollAmount: 'oRA',
  playerSummonedAmount: 'pSA',
  opponentSummonedAmount: 'oSA',
  playerLevel3Sold: 'pL3',
  opponentLevel3Sold: 'oL3',
  playerTransformationAmount: 'pTA',
  opponentTransformationAmount: 'oTA',
  playerPets: 'p',
  opponentPets: 'o',
  allPets: 'ap',
  logFilter: 'lf',
  customPacks: 'cp',
  oldStork: 'os',
  tokenPets: 'tp',
  komodoShuffle: 'ks',
  mana: 'm',
  seed: 'sd',
  triggersConsumed: 'tc',
  showAdvanced: 'sa',
  showTriggerNamesInLogs: 'stn',
  showPositionalArgsInLogs: 'spa',
  showSwallowedLevels: 'swl',
  ailmentEquipment: 'ae',
  name: 'n',
  attack: 'a',
  health: 'h',
  exp: 'e',
  equipment: 'eq',
  belugaSwallowedPet: 'bSP',
  abominationSwallowedPet1: 'aSP1',
  abominationSwallowedPet2: 'aSP2',
  abominationSwallowedPet3: 'aSP3',
  abominationSwallowedPet1BelugaSwallowedPet: 'aSP1B',
  abominationSwallowedPet2BelugaSwallowedPet: 'aSP2B',
  abominationSwallowedPet3BelugaSwallowedPet: 'aSP3B',
  abominationSwallowedPet1SarcasticFringeheadSwallowedPet: 'aSP1SFS',
  abominationSwallowedPet2SarcasticFringeheadSwallowedPet: 'aSP2SFS',
  abominationSwallowedPet3SarcasticFringeheadSwallowedPet: 'aSP3SFS',
  abominationSwallowedPet1Level: 'aSP1L',
  abominationSwallowedPet2Level: 'aSP2L',
  abominationSwallowedPet3Level: 'aSP3L',
  abominationSwallowedPet1TimesHurt: 'aSP1T',
  abominationSwallowedPet2TimesHurt: 'aSP2T',
  abominationSwallowedPet3TimesHurt: 'aSP3T',
  parrotCopyPet: 'pCP',
  parrotCopyPetBelugaSwallowedPet: 'pCPB',
  ...PARROT_COPY_PET_ABOMINATION_KEY_MAP,
  abominationSwallowedPet1ParrotCopyPet: 'aSP1PCP',
  abominationSwallowedPet2ParrotCopyPet: 'aSP2PCP',
  abominationSwallowedPet3ParrotCopyPet: 'aSP3PCP',
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: 'aSP1PCPB',
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: 'aSP2PCPB',
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: 'aSP3PCPB',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: 'aSP1PCPAS1',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: 'aSP1PCPAS2',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: 'aSP1PCPAS3',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: 'aSP2PCPAS1',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: 'aSP2PCPAS2',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: 'aSP2PCPAS3',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: 'aSP3PCPAS1',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: 'aSP3PCPAS2',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: 'aSP3PCPAS3',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
    'aSP1PCPAS1B',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
    'aSP1PCPAS2B',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
    'aSP1PCPAS3B',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
    'aSP2PCPAS1B',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
    'aSP2PCPAS2B',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
    'aSP2PCPAS3B',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
    'aSP3PCPAS1B',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
    'aSP3PCPAS2B',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
    'aSP3PCPAS3B',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level:
    'aSP1PCPAS1L',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level:
    'aSP1PCPAS2L',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level:
    'aSP1PCPAS3L',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level:
    'aSP2PCPAS1L',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level:
    'aSP2PCPAS2L',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level:
    'aSP2PCPAS3L',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level:
    'aSP3PCPAS1L',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level:
    'aSP3PCPAS2L',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level:
    'aSP3PCPAS3L',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt:
    'aSP1PCPAS1T',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt:
    'aSP1PCPAS2T',
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt:
    'aSP1PCPAS3T',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt:
    'aSP2PCPAS1T',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt:
    'aSP2PCPAS2T',
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt:
    'aSP2PCPAS3T',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt:
    'aSP3PCPAS1T',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt:
    'aSP3PCPAS2T',
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt:
    'aSP3PCPAS3T',
  timesHurt: 'tH',
};
