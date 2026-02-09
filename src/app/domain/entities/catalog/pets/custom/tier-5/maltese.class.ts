import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Maltese extends Pet {
  name = 'Maltese';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new MalteseAbility(this, this.logService));
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


export class MalteseAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Maltese Ability',
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
    const owner = this.owner;
    const player = owner.parent;
    const trumpetsAvailable = player.trumpets;
    if (trumpetsAvailable > 0) {
      player.spendTrumpets(trumpetsAvailable, owner, context.pteranodon);
    }

    const friends = player.petArray.filter(
      (pet) => pet.alive && pet !== owner,
    );
    if (friends.length === 0 || trumpetsAvailable <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const multiplier = this.level + 1;
    const totalMana = trumpetsAvailable * multiplier;
    const perFriend = Math.floor(totalMana / friends.length);
    let remainder = totalMana % friends.length;
    for (const friend of friends) {
      const manaGain = perFriend + (remainder > 0 ? 1 : 0);
      if (manaGain > 0) {
        friend.increaseMana(manaGain);
      }
      remainder = Math.max(0, remainder - 1);
    }

    this.logService.createLog({
      message: `${owner.name} converted ${trumpetsAvailable} trumpets into ${totalMana} mana and spread it to friends.`,
      type: 'ability',
      player: player,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MalteseAbility {
    return new MalteseAbility(newOwner, this.logService);
  }
}



