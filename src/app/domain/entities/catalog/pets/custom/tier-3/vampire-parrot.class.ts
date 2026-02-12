import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class VampireParrot extends Pet {
  name = 'Vampire Parrot';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;
  override initAbilities(): void {
    this.addAbility(new VampireParrotAbility(this, this.logService));
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


export class VampireParrotAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Vampire Parrot Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const eligiblePets = owner.parent.petArray.filter(
      (pet) => pet.alive && pet.equipment,
    );
    const uniqueAilments = new Set<string>();

    for (const pet of eligiblePets) {
      const equipmentClass = (
        pet.equipment as Equipment & { equipmentClass?: string }
      ).equipmentClass;
      if (
        equipmentClass === 'ailment-attack' ||
        equipmentClass === 'ailment-defense' ||
        equipmentClass === 'ailment-other'
      ) {
        uniqueAilments.add(pet.equipment.name);
      }
    }

    const count = uniqueAilments.size;
    if (count === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const attackPerPet = this.level;
    const healthPerPet = this.level * 2;
    const attackBuff = count * attackPerPet;
    const healthBuff = count * healthPerPet;
    owner.increaseAttack(attackBuff);
    owner.increaseHealth(healthBuff);

    this.logService.createLog({
      message: `${owner.name} gained +${attackBuff}/+${healthBuff} (+${attackPerPet}/+${healthPerPet} per unique ailment) from ${count} friendly pets with different ailments.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): VampireParrotAbility {
    return new VampireParrotAbility(newOwner, this.logService);
  }
}


