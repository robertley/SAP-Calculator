import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Peanut } from 'app/domain/entities/catalog/equipment/turtle/peanut.class';


export class TerrorBird extends Pet {
  name = 'Terror Bird';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 8;
  health = 3;
  initAbilities(): void {
    this.addAbility(new TerrorBirdAbility(this, this.logService));
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


export class TerrorBirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TerrorBirdAbility',
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
    const owner = this.owner;
    const { tiger, pteranodon } = context;

    const strawberryPets = owner.parent.petArray
      .filter(
        (pet) =>
          pet &&
          pet !== owner &&
          pet.alive &&
          pet.equipment?.name === 'Strawberry',
      )
      .sort((a, b) => a.position - b.position)
      .slice(0, this.level);

    if (strawberryPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const pet of strawberryPets) {
      pet.givePetEquipment(new Peanut());
    }

    const names = strawberryPets.map((pet) => pet.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} gave Peanut to ${names} at start of battle.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TerrorBirdAbility {
    return new TerrorBirdAbility(newOwner, this.logService);
  }
}



