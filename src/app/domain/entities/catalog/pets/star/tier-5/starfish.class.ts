import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Starfish extends Pet {
  name = 'Starfish';
  tier = 5;
  pack: Pack = 'Star';
  attack = 3;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new StarfishAbility(this, this.logService, this.abilityService),
    );
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


export class StarfishAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'StarfishAbility',
      owner: owner,
      triggers: ['FriendSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const soldPet = context.triggerPet;
    if (!soldPet || soldPet.level !== 3) {
      this.triggerTigerExecution(context);
      return;
    }

    const multiplier = soldPet.attack >= 10 ? 3 : 1;
    const buff = this.level * multiplier;
    const targets = owner.parent.petArray.filter((pet) => pet.alive);
    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} gave friends +${buff}/+${buff}${multiplier > 1 ? ' (triple bonus)' : ''}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): StarfishAbility {
    return new StarfishAbility(newOwner, this.logService, this.abilityService);
  }
}


