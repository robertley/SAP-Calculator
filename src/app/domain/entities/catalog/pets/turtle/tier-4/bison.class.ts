import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Bison extends Pet {
  name = 'Bison';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new BisonAbility(this, this.logService));
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


export class BisonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BisonAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const hasLevel3Friend = owner.parent.petArray.some(
      (pet) => pet && pet !== owner && pet.level >= 3,
    );
    if (!hasLevel3Friend) {
      return;
    }
    const attackGain = this.level;
    const healthGain = this.level * 2;
    owner.increaseAttack(attackGain);
    owner.increaseHealth(healthGain);
    this.logService.createLog({
      message: `${owner.name} gained +${attackGain} attack and +${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BisonAbility {
    return new BisonAbility(newOwner, this.logService);
  }
}


