import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { shuffle } from 'app/runtime/random';


export class SiberianHusky extends Pet {
  name = 'Siberian Husky';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new SiberianHuskyAbility(this, this.logService));
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


export class SiberianHuskyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Siberian Husky Ability',
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
    const buff = this.level;
    const candidates = owner.parent.petArray.filter((friend) => {
      if (!friend || friend === owner || !friend.alive) {
        return false;
      }
      return (
        friend.equipment == null || friend.equipment.equipmentClass !== 'shop'
      );
    });
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    shuffle(candidates);
    const targets = candidates.slice(0, 3);
    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SiberianHuskyAbility {
    return new SiberianHuskyAbility(newOwner, this.logService);
  }
}






