import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Gerenuk extends Pet {
  name = 'Gerenuk';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new GerenukAbility(this, this.logService));
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


export class GerenukAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Gerenuk Ability',
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
    const opponent = owner.parent.opponent;
    let removals = this.level;

    while (removals > 0) {
      const target = this.getHighestTierPerkPet(opponent);
      if (!target) {
        break;
      }

      const perkName = target.equipment?.name ?? 'perk';
      target.removePerk(true);

      this.logService.createLog({
        message: `${owner.name} removed ${target.name}'s ${perkName}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });

      removals--;
    }

    this.triggerTigerExecution(context);
  }

  private getHighestTierPerkPet(opponent: Player): Pet | null {
    const candidates = opponent.petArray.filter(
      (pet) =>
        pet.alive && pet.equipment && !this.isAilmentEquipment(pet.equipment),
    );

    if (candidates.length === 0) {
      return null;
    }

    let highestTier = Math.max(
      ...candidates.map((pet) => pet.equipment?.tier ?? 0),
    );

    const highestTierPets = candidates
      .filter((pet) => (pet.equipment?.tier ?? 0) === highestTier)
      .sort((a, b) => a.position - b.position);

    return highestTierPets[0] ?? null;
  }

  private isAilmentEquipment(equipment: Equipment): boolean {
    return (
      equipment.equipmentClass === 'ailment-attack' ||
      equipment.equipmentClass === 'ailment-defense' ||
      equipment.equipmentClass === 'ailment-other'
    );
  }

  override copy(newOwner: Pet): GerenukAbility {
    return new GerenukAbility(newOwner, this.logService);
  }
}
