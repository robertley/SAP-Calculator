import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class WoollyRhino extends Pet {
  name = 'Woolly Rhino';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 3;
  health = 7;
  initAbilities(): void {
    this.addAbility(new WoollyRhinoAbility(this, this.logService));
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


export class WoollyRhinoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Woolly Rhino Ability',
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
    const ailments = new Set<string>();
    for (const pet of owner.parent.petArray) {
      const eq = pet?.equipment;
      if (
        eq?.equipmentClass === 'ailment-attack' ||
        eq?.equipmentClass === 'ailment-defense' ||
        eq?.equipmentClass === 'ailment-other'
      ) {
        ailments.add(eq.name);
      }
    }

    const ailmentCount = ailments.size;
    if (ailmentCount <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const damage = 4 * ailmentCount;
    const targets = owner.parent.opponent.petArray.filter((pet) => pet.alive);
    const targetCount = Math.min(this.level, targets.length);
    for (let i = 0; i < targetCount; i++) {
      owner.snipePet(targets[i], damage, false, context.tiger, context.pteranodon);
    }

    if (targetCount > 0) {
      this.logService.createLog({
        message: `${owner.name} dealt ${damage} damage to ${targetCount} enemy${targetCount === 1 ? '' : 'ies'}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WoollyRhinoAbility {
    return new WoollyRhinoAbility(newOwner, this.logService);
  }
}


