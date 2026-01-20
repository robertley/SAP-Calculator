import * as perks from "../../files/perks.json";
import * as toys from "../../files/toys.json";
import * as petsByTier from "../../files/pets.json";

export const PETS_BY_ID = new Map<string, string>();
export const PETS_META_BY_ID = new Map<string, { name: string; tier: number }>();

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
  0: "Turtle",
  1: "Puppy",
  2: "Star",
  5: "Golden",
  6: "Unicorn",
  7: "Danger",
};

export const KEY_MAP: Record<string, string> = {
  playerPack: "pP",
  opponentPack: "oP",
  playerToy: "pT",
  playerToyLevel: "pTL",
  playerHardToy: "pHT",
  playerHardToyLevel: "pHTL",
  opponentToy: "oT",
  opponentToyLevel: "oTL",
  opponentHardToy: "oHT",
  opponentHardToyLevel: "oHTL",
  turn: "t",
  playerGoldSpent: "pGS",
  opponentGoldSpent: "oGS",
  playerRollAmount: "pRA",
  opponentRollAmount: "oRA",
  playerSummonedAmount: "pSA",
  opponentSummonedAmount: "oSA",
  playerLevel3Sold: "pL3",
  opponentLevel3Sold: "oL3",
  playerTransformationAmount: "pTA",
  opponentTransformationAmount: "oTA",
  playerPets: "p",
  opponentPets: "o",
  allPets: "ap",
  logFilter: "lf",
  customPacks: "cp",
  oldStork: "os",
  tokenPets: "tp",
  komodoShuffle: "ks",
  mana: "m",
  triggersConsumed: "tc",
  showAdvanced: "sa",
  showSwallowedLevels: "swl",
  ailmentEquipment: "ae",
  name: "n",
  attack: "a",
  health: "h",
  exp: "e",
  equipment: "eq",
  belugaSwallowedPet: "bSP",
  parrotCopyPet: "pCP",
  parrotCopyPetBelugaSwallowedPet: "pCPB",
  parrotCopyPetAbominationSwallowedPet1: "pCPAS1",
  parrotCopyPetAbominationSwallowedPet2: "pCPAS2",
  parrotCopyPetAbominationSwallowedPet3: "pCPAS3",
  parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "pCPAS1B",
  parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "pCPAS2B",
  parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "pCPAS3B",
  parrotCopyPetAbominationSwallowedPet1Level: "pCPAS1L",
  parrotCopyPetAbominationSwallowedPet2Level: "pCPAS2L",
  parrotCopyPetAbominationSwallowedPet3Level: "pCPAS3L",
  parrotCopyPetAbominationSwallowedPet1TimesHurt: "pCPAS1T",
  parrotCopyPetAbominationSwallowedPet2TimesHurt: "pCPAS2T",
  parrotCopyPetAbominationSwallowedPet3TimesHurt: "pCPAS3T",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPet: "pCPAS1PCP",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPet: "pCPAS2PCP",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPet: "pCPAS3PCP",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: "pCPAS1PCPB",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: "pCPAS2PCPB",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: "pCPAS3PCPB",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: "pCPAS1PCPAS1",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: "pCPAS1PCPAS2",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: "pCPAS1PCPAS3",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: "pCPAS2PCPAS1",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: "pCPAS2PCPAS2",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: "pCPAS2PCPAS3",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: "pCPAS3PCPAS1",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: "pCPAS3PCPAS2",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: "pCPAS3PCPAS3",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "pCPAS1PCPAS1B",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "pCPAS1PCPAS2B",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "pCPAS1PCPAS3B",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "pCPAS2PCPAS1B",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "pCPAS2PCPAS2B",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "pCPAS2PCPAS3B",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "pCPAS3PCPAS1B",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "pCPAS3PCPAS2B",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "pCPAS3PCPAS3B",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: "pCPAS1PCPAS1L",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: "pCPAS1PCPAS2L",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: "pCPAS1PCPAS3L",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: "pCPAS2PCPAS1L",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: "pCPAS2PCPAS2L",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: "pCPAS2PCPAS3L",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: "pCPAS3PCPAS1L",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: "pCPAS3PCPAS2L",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: "pCPAS3PCPAS3L",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: "pCPAS1PCPAS1T",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: "pCPAS1PCPAS2T",
  parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: "pCPAS1PCPAS3T",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: "pCPAS2PCPAS1T",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: "pCPAS2PCPAS2T",
  parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: "pCPAS2PCPAS3T",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: "pCPAS3PCPAS1T",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: "pCPAS3PCPAS2T",
  parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: "pCPAS3PCPAS3T",
  abominationSwallowedPet1ParrotCopyPet: "aSP1PCP",
  abominationSwallowedPet2ParrotCopyPet: "aSP2PCP",
  abominationSwallowedPet3ParrotCopyPet: "aSP3PCP",
  abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet: "aSP1PCPB",
  abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet: "aSP2PCPB",
  abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet: "aSP3PCPB",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1: "aSP1PCPAS1",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2: "aSP1PCPAS2",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3: "aSP1PCPAS3",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1: "aSP2PCPAS1",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2: "aSP2PCPAS2",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3: "aSP2PCPAS3",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1: "aSP3PCPAS1",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2: "aSP3PCPAS2",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3: "aSP3PCPAS3",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP1PCPAS1B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP1PCPAS2B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP1PCPAS3B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP2PCPAS1B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP2PCPAS2B",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP2PCPAS3B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: "aSP3PCPAS1B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: "aSP3PCPAS2B",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: "aSP3PCPAS3B",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level: "aSP1PCPAS1L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level: "aSP1PCPAS2L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level: "aSP1PCPAS3L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level: "aSP2PCPAS1L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level: "aSP2PCPAS2L",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level: "aSP2PCPAS3L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level: "aSP3PCPAS1L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level: "aSP3PCPAS2L",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level: "aSP3PCPAS3L",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP1PCPAS1T",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP1PCPAS2T",
  abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP1PCPAS3T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP2PCPAS1T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP2PCPAS2T",
  abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP2PCPAS3T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt: "aSP3PCPAS1T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt: "aSP3PCPAS2T",
  abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt: "aSP3PCPAS3T",
  timesHurt: "tH",
};
