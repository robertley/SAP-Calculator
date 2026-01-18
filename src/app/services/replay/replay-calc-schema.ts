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
  timesHurt: "tH",
};
