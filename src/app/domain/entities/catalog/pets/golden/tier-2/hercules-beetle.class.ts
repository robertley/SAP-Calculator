import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class HerculesBeetle extends Pet {
  name = 'Hercules Beetle';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new HerculesBeetleAbility(this, this.logService, this.abilityService),
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


export class HerculesBeetleAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'HerculesBeetleAbility',
      owner: owner,
      triggers: ['ThisSold'],
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
    const battles = Math.max(0, owner.battlesFought ?? 0);
    const totalBuff = battles * this.level;
    const friends = owner.parent.petArray.filter((pet) => pet.alive);
    if (totalBuff <= 0 || friends.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const perFriend = Math.floor(totalBuff / friends.length);
    let remainder = totalBuff % friends.length;
    for (const friend of friends) {
      if (perFriend > 0) {
        friend.increaseAttack(perFriend);
      }
    }
    if (remainder > 0) {
      const shuffled = [...friends].sort(() => Math.random() - 0.5);
      for (let i = 0; i < remainder && i < shuffled.length; i++) {
        shuffled[i].increaseAttack(1);
      }
    }

    this.logService.createLog({
      message: `${owner.name} gave friends +${totalBuff} attack split evenly after ${battles} battle${battles === 1 ? '' : 's'}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: friends.length > 1,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HerculesBeetleAbility {
    return new HerculesBeetleAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


