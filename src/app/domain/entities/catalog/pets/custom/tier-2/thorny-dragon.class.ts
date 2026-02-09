import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getRandomInt } from 'app/runtime/random';


export class ThornyDragon extends Pet {
  name = 'Thorny Dragon';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  hasRandomEvents = true;

  override initAbilities(): void {
    this.addAbility(new ThornyDragonAbility(this, this.logService));
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


export class ThornyDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Thorny Dragon Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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
    const damage = 3 * this.level;

    const opponentPets = owner.parent.opponent.petArray.filter((p) => p.alive);
    if (opponentPets.length === 0) return;

    // Prioritize pets with ailments
    const petsWithAilments = opponentPets.filter((p) => {
      if (!p.equipment) return false;
      return (
        p.equipment.equipmentClass === 'ailment-attack' ||
        p.equipment.equipmentClass === 'ailment-defense' ||
        p.equipment.equipmentClass === 'ailment-other'
      );
    });

    const targetPool =
      petsWithAilments.length > 0 ? petsWithAilments : opponentPets;
    const isRandom = targetPool.length > 1;
    const target = targetPool[getRandomInt(0, targetPool.length - 1)];

    if (target) {
      owner.snipePet(target, damage, isRandom, tiger, pteranodon);

      this.logService.createLog({
        message: `${owner.name} fainted and dealt ${damage} damage to ${target.name} (prioritizing ailments).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: isRandom,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): ThornyDragonAbility {
    return new ThornyDragonAbility(newOwner, this.logService);
  }
}







