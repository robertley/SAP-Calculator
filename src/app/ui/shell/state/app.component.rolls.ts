import { Player } from 'app/domain/entities/player.class';

export const ROLL_PETS = [
  'Nessie',
  'Bunyip',
  'Mana Hound',
  'Ammonite',
  'Fossa',
  'Hippocampus',
  'Platybelodon',
  'Barnacle',
  'Olm',
];

export function shouldShowRollInputs(
  players: Array<Player | undefined | null>,
): boolean {
  for (const player of players) {
    if (!player || !player.petArray) continue;
    for (const pet of player.petArray) {
      if (!pet) continue;

      if (ROLL_PETS.includes(pet.name)) {
        return true;
      }

      if (pet.name === 'Abomination') {
        if (ROLL_PETS.includes(pet.abominationSwallowedPet1)) return true;
        if (ROLL_PETS.includes(pet.abominationSwallowedPet2)) return true;
        if (ROLL_PETS.includes(pet.abominationSwallowedPet3)) return true;
        if (
          pet.abominationSwallowedPet1 === 'Beluga Whale' &&
          ROLL_PETS.includes(pet.abominationSwallowedPet1BelugaSwallowedPet)
        )
          return true;
        if (
          pet.abominationSwallowedPet2 === 'Beluga Whale' &&
          ROLL_PETS.includes(pet.abominationSwallowedPet2BelugaSwallowedPet)
        )
          return true;
        if (
          pet.abominationSwallowedPet3 === 'Beluga Whale' &&
          ROLL_PETS.includes(pet.abominationSwallowedPet3BelugaSwallowedPet)
        )
          return true;
      }

      if (
        pet.name === 'Beluga Whale' &&
        ROLL_PETS.includes(pet.belugaSwallowedPet)
      ) {
        return true;
      }

      if (
        pet.name === 'Sarcastic Fringehead' &&
        ROLL_PETS.includes(pet.sarcasticFringeheadSwallowedPet)
      ) {
        return true;
      }
    }
  }

  return false;
}

