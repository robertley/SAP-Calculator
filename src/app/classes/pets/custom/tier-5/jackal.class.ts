import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Jackal extends Pet {
  name = 'Jackal';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new JackalAbility(this, this.logService));
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


export class JackalAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Jackal Ability',
      owner: owner,
      triggers: ['AnyoneFlung'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const movedPet = context.triggerPet;
    if (!movedPet || movedPet !== owner) {
      return;
    }

    const statTargets = [13, 26, 39];
    const newValue =
      statTargets[
        Math.min(Math.max(this.level - 1, 0), statTargets.length - 1)
      ];
    owner.attack = newValue;
    owner.health = newValue;

    this.logService.createLog({
      message: `${owner.name} was flung and reset to ${newValue}/${newValue}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): JackalAbility {
    return new JackalAbility(newOwner, this.logService);
  }
}
