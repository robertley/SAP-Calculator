import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BlueRingedOctopus extends Pet {
  name = 'Blue Ringed Octopus';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new BlueRingedOctopusAbility(this, this.logService, this.abilityService),
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


export class BlueRingedOctopusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BlueRingedOctopusAbility',
      owner: owner,
      triggers: ['ThisBought'],
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
    const buff = this.level;
    const friends = owner.parent.petArray.filter(
      (pet) => pet.alive && pet !== owner,
    );
    if (friends.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const friend of friends) {
      friend.increaseAttack(buff);
      friend.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} gave friends +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BlueRingedOctopusAbility {
    return new BlueRingedOctopusAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
