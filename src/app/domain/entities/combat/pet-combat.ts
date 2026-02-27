import type { Pet } from '../pet.class';
import { Equipment } from '../equipment.class';
import { Peanut } from 'app/domain/entities/catalog/equipment/turtle/peanut.class';
import { PeanutButter } from 'app/domain/entities/catalog/equipment/hidden/peanut-butter';
import { WhiteTruffle } from 'app/domain/entities/catalog/equipment/danger/white-truffle.class';
import { Salt } from 'app/domain/entities/catalog/equipment/puppy/salt.class';
import { Cheese } from 'app/domain/entities/catalog/equipment/star/cheese.class';
import { FortuneCookie } from 'app/domain/entities/catalog/equipment/custom/fortune-cookie.class';
import { Pepper } from 'app/domain/entities/catalog/equipment/star/pepper.class';
import { Sleepy } from 'app/domain/entities/catalog/equipment/ailments/sleepy.class';
import {
  MapleSyrup,
  MapleSyrupAttack,
} from 'app/domain/entities/catalog/equipment/golden/maple-syrup.class';
import { calculateDamage } from './pet-combat-damage';
export { calculateDamage } from './pet-combat-damage';

type DamageResponse = ReturnType<typeof calculateDamage>;

const MANTICORE_AILMENTS = ['Weak', 'Cold', 'Icky', 'Spooked'];

function appendIckyMessage(message: string, pet: Pet): string {
  if (pet.equipment?.name != 'Icky') {
    return message;
  }

  let updated = `${message}x2 (Icky)`;
  if (pet.equipment.multiplier > 1) {
    updated += pet.equipment.multiplierMessage;
  }
  return updated;
}

function appendManticoreMessage(message: string, self: Pet, pet: Pet): string {
  const manticoreMult = self.getManticoreMult();
  const petEquipName = pet.equipment?.name ?? '';
  if (manticoreMult.length === 0 || !MANTICORE_AILMENTS.includes(petEquipName)) {
    return message;
  }

  let updated = message;
  for (const mult of manticoreMult) {
    updated += ` x${mult + 1} (Manticore)`;
  }
  return updated;
}

function appendDamageReductionMessages(
  message: string,
  damageResp: DamageResponse,
  includeMapleSyrupReduction: boolean,
): string {
  let updated = message;
  if (damageResp.nurikabe > 0) {
    updated += ` -${damageResp.nurikabe} (Nurikabe)`;
  }
  if ((damageResp.fairyBallReduction ?? 0) > 0) {
    updated += ` -${damageResp.fairyBallReduction} (Fairy Ball)`;
  }
  if ((damageResp.fanMusselReduction ?? 0) > 0) {
    updated += ` -${damageResp.fanMusselReduction} (Fan Mussel)`;
  }
  if ((damageResp.ghostKittenReduction ?? 0) > 0) {
    updated += ` -${damageResp.ghostKittenReduction} (Ghost Kitten)`;
  }
  if (includeMapleSyrupReduction && (damageResp.mapleSyrupReduction ?? 0) > 0) {
    updated += ` -${damageResp.mapleSyrupReduction} (Maple Syrup)`;
  }
  return updated;
}

function getAlbatrossAuraBonusFromPet(pet: Pet | null | undefined): number {
  if (!pet || !pet.alive) {
    return 0;
  }
  if (!pet.hasTrigger(undefined, 'Pet', 'Albatross Ability')) {
    return 0;
  }
  let bonus = 0;
  for (const ability of pet.abilityList) {
    if (ability.name === 'Albatross Ability') {
      bonus += ability.level * 3;
    }
  }
  return bonus;
}

function getAdjacentAlbatrossAuraBonus(self: Pet): number {
  if ((self.tier ?? Number.POSITIVE_INFINITY) > 4) {
    return 0;
  }
  let totalBonus = 0;
  totalBonus += getAlbatrossAuraBonusFromPet(self.petAhead);
  totalBonus += getAlbatrossAuraBonusFromPet(self.petBehind());
  return totalBonus;
}


export function attackPet(
  self: Pet,
  pet: Pet,
  jumpAttack: boolean = false,
  power?: number,
  random: boolean = false,
): void {
  self.timesAttacked++;
  let damageResp = calculateDamage(self, pet, self.getManticoreMult(), power);
  let attackEquipment = damageResp.attackEquipment;
  let defenseEquipment = damageResp.defenseEquipment;
  let damage = damageResp.damage;
  const usedSleepy = self.equipment instanceof Sleepy;
  if (usedSleepy) {
    damage = Math.floor(damage / 2);
  }

  let attackMultiplier = self.equipment?.multiplier ?? 1;
  let defenseMultiplier = pet.equipment?.multiplier ?? 1;
  self.currentTarget = pet;
  let message: string;
  if (jumpAttack) {
    message = `${self.name} jump-attacks ${pet.name} for ${damage}.`;
    if (self.equipment instanceof WhiteTruffle) {
      message += ' (White Truffle)';
    }
  } else {
    message = `${self.name} attacks ${pet.name} for ${damage}.`;
  }
  if (usedSleepy) {
    message += ' (Sleepy x0.5)';
  }
  // peanut death
  if (attackEquipment instanceof Peanut && damage > 0) {
    self.createLog({
      message: `${message} (Peanut)`,
      type: 'attack',
      player: self.parent,
      sourcePet: self,
      targetPet: pet,
      randomEvent: random,
    });
    dealDamage(self, pet, damage);
    pet.killedBy = self;
    pet.health = 0;
  } else if (
    attackEquipment instanceof PeanutButter &&
    damage > 0 &&
    attackEquipment.uses > 0
  ) {
    self.createLog({
      message: `${message} (Peanut Butter)`,
      type: 'attack',
      player: self.parent,
      sourcePet: self,
      targetPet: pet,
      randomEvent: random,
    });

    pet.killedBy = self;
    dealDamage(self, pet, damage);
    pet.health = 0;
  } else {
    dealDamage(self, pet, damage);
    if (attackEquipment != null) {
      const attackPower = attackEquipment.power ?? 0;
      let power: number | string = Math.abs(attackPower);
      let sign = '-';
      if (attackPower > 0) {
        sign = '+';
      }
      let powerAmt = `${sign}${power}`;
      if (attackEquipment instanceof Salt) {
        powerAmt = `x2`;
      }
      if (attackEquipment instanceof MapleSyrupAttack) {
        powerAmt = `x0.5`;
      }
      if (attackEquipment instanceof Cheese) {
        if (damage <= 15) {
          powerAmt = '=15';
        } else {
          powerAmt = '+0';
        }
      }
      if (attackEquipment instanceof FortuneCookie) {
        random = true;
        if (damageResp.fortuneCookie) {
          powerAmt = `x2`;
          if (attackEquipment.multiplier > 1) {
            powerAmt += attackEquipment.multiplierMessage;
          }
        } else {
          powerAmt = `x1`;
        }
      }

      message += ` (${attackEquipment.name} ${powerAmt})`;

      if (attackMultiplier > 1 && self.equipment) {
        message += self.equipment.multiplierMessage;
      }
    }
    if (defenseEquipment != null) {
      const defensePower = defenseEquipment.power ?? 0;
      let power: number | string = Math.abs(defensePower);
      let sign = '-';
      if (defensePower < 0) {
        sign = '+';
      }
      if (defenseEquipment.name === 'Coconut') {
        message += ` (${defenseEquipment.name} block)`;
      } else if (defenseEquipment.name === 'Strawberry') {
        let sparrowLevel = pet.getSparrowLevel();
        if (sparrowLevel > 0) {
          power = sparrowLevel * 5;
          message += ` (Strawberry -${power} (Sparrow))`;
        }
      } else if (defenseEquipment instanceof Pepper) {
        if (pet.health == 1) {
          sign = '!';
        } else {
          sign = '-';
        }
        power = '';
        message += ` (${defenseEquipment.name} ${sign}${power})`;
      } else if (defenseEquipment instanceof MapleSyrup) {
        power = 'x0.5';
        message += ` (${defenseEquipment.name} ${power})`;
      } else {
        message += ` (${defenseEquipment.name} ${sign}${power})`;
      }

      if (defenseMultiplier > 1 && pet.equipment) {
        message += pet.equipment.multiplierMessage;
      }
      //pet.useDefenseEquipment();
    }

    message = appendIckyMessage(message, pet);
    message = appendDamageReductionMessages(message, damageResp, true);
    message = appendManticoreMessage(message, self, pet);

    self.createLog({
      message: message,
      type: 'attack',
      player: self.parent,
      sourcePet: self,
      targetPet: pet,
      randomEvent: random,
    });
    let skewerEquipment: Equipment | null =
      self.equipment?.equipmentClass == 'skewer' ? self.equipment : null;
    skewerEquipment?.attackCallback?.(self, pet);
  }

  if (usedSleepy) {
    self.removePerk();
  }

  // unified friend attack events (includes friendAttacks, friendAheadAttacks, and enemyAttacks)
  self.triggerAttackEventsFor();
  self.applyCrisp();
  const opponentPet = self.parent.opponent?.petArray?.[0];
  if (opponentPet) {
    opponentPet.applyCrisp();
  }
}

export function snipePet(
  self: Pet,
  pet: Pet,
  power: number,
  randomEvent?: boolean,
  tiger?: boolean,
  pteranodon?: boolean,
  equipment?: boolean,
  mana?: boolean,
  logVerb: 'sniped' | 'attacked' = 'sniped',
  basePowerForLog?: number,
): number {
  const albatrossBonus = getAdjacentAlbatrossAuraBonus(self);
  if (albatrossBonus > 0) {
    power += albatrossBonus;
  }

  let damageResp = calculateDamage(
    self,
    pet,
    self.getManticoreMult(),
    power,
    true,
  );
  let attackEquipment = damageResp.attackEquipment;
  let defenseEquipment = damageResp.defenseEquipment;
  let damage = damageResp.damage;
  if (self.equipment?.name === 'Kiwano' && damage > 0) {
    damage += 8;
    self.createLog({
      message: `${self.name} added +8 damage. (Kiwano)`,
      type: 'equipment',
      player: self.parent,
    });
    self.removePerk();
  }

  dealDamage(self, pet, damage);

  let message = `${self.name} ${logVerb} ${pet.name} for ${damage}.`;
  if (
    basePowerForLog != null &&
    self.equipment?.multiplier != null &&
    self.equipment.multiplier > 1
  ) {
    message += ` (${basePowerForLog}*${self.equipment.multiplier})`;
  }
  if (defenseEquipment != null) {
    pet.useDefenseEquipment(true);
    const defensePower = defenseEquipment.power ?? 0;
    let power = Math.abs(defensePower);
    let sign = '-';
    if (defensePower < 0) {
      sign = '+';
    }
    if (defenseEquipment.name === 'Coconut') {
      message += ` (${defenseEquipment.name} block)`;
    } else if (defenseEquipment.name === 'Strawberry') {
      let sparrowLevel = pet.getSparrowLevel();
      if (sparrowLevel > 0) {
        power = sparrowLevel * 5;
        message += ` (Strawberry -${power} (Sparrow))`;
      }
    } else {
      message += ` (${defenseEquipment.name} ${sign}${power})`;
    }
    message += defenseEquipment.multiplierMessage;
  }
  if (
    attackEquipment != null &&
    attackEquipment.equipmentClass == 'attack-snipe'
  ) {
    const attackPower = attackEquipment.power ?? 0;
    let power = Math.abs(attackPower);
    let sign = '-';
    if (attackPower > 0) {
      sign = '+';
    }
    message += ` (${attackEquipment.name} ${sign}${power})`;
    if (self.equipment?.multiplier && self.equipment.multiplier > 1) {
      message += self.equipment.multiplierMessage;
    }
  }

  if (tiger) {
    message += ' (Tiger)';
  }

  if (albatrossBonus > 0) {
    message += ` (+${albatrossBonus} Albatross)`;
  }

  if (equipment && self.equipment) {
    message += ` (${self.equipment.name})`;
  }

  if (mana) {
    message += ' (Mana)';
  }

  message = appendIckyMessage(message, pet);
  message = appendManticoreMessage(message, self, pet);
  message = appendDamageReductionMessages(message, damageResp, false);

  self.createLog({
    message: message,
    type: 'attack',
    randomEvent: randomEvent,
    player: self.parent,
    sourcePet: self,
    targetPet: pet,
    pteranodon: pteranodon,
  });

  if (
    attackEquipment != null &&
    attackEquipment.equipmentClass == 'attack-snipe' &&
    self.equipment?.uses != null
  ) {
    self.equipment.uses -= 1;
    if (self.equipment.uses <= 0) {
      self.removePerk();
    }
  }

  return damage;
}

export function jumpAttack(
  self: Pet,
  target: Pet,
  tiger?: boolean,
  damage?: number,
  randomEvent: boolean = false,
): void {
  // Set current target for tracking
  target.lastAttacker = self;

  let attackPet: Pet;
  if (self.transformed) {
    attackPet = self.transformedInto ?? self;
  } else {
    attackPet = self;
  }

  if (target.transformed) {
    target = target.transformedInto ?? target;
  }
  // 3. Check if jumping pet is still alive
  if (!attackPet.alive || !target.alive) {
    return;
  }

  // 4. Perform the attack
  attackPet.attackPet(target, true, damage, randomEvent);
  target.attackPet(attackPet);

  attackPet.useAttackDefenseEquipment();
  target.useAttackDefenseEquipment();

  attackPet.executeAfterAttackEvents();
  // 6. Trigger and execute friend/enemy jumped abilities
  attackPet.triggerJumpEventsFor();
}

export function dealDamage(self: Pet, pet: Pet, damage: number): void {
  if (!pet.alive) {
    return;
  }
  if (damage >= pet.health && pet.equipment?.name == 'Bok Choy') {
    let healthGain = 4 * pet.equipment.multiplier;
    self.createLog({
      message: `${pet.name} gained ${healthGain} health (Bok Choy) ${pet.equipment.multiplierMessage} `,
      type: 'equipment',
      player: pet.parent,
    });
    pet.increaseHealth(healthGain);
    pet.removePerk();
  }
  pet.health -= damage;

  // Track who killed this pet
  if (pet.health <= 0) {
    pet.killedBy = self;
  }
  if (damage > 0) {
    pet.timesHurt++;
  }
  // knockout
  if (pet.health < 1) {
    self.triggerKillEventsFor(pet);
  }

  // this hurt ability - new trigger system
  if (damage > 0) {
    self.triggerHurtEventsFor(pet, damage);
  }
}



