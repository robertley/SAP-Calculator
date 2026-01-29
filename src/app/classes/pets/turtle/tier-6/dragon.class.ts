import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Dragon extends Pet {
  name = 'Dragon';
  tier = 6;
  pack: Pack = 'Turtle';
  attack = 3;
  health = 8;
  initAbilities(): void {
    this.addAbility(new DragonAbility(this, this.logService, this.abilityService));
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


export class DragonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'DragonAbility',
      owner: owner,
      triggers: ['Tier1FriendBought'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 4,
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
    const targets = owner.parent.petArray.filter((pet) => pet && pet.alive);
    if (targets.length === 0) {
      return;
    }

    for (const pet of targets) {
      pet.increaseAttack(buff);
      pet.increaseHealth(buff);
    }

    this.logService.createLog({
      message: `${owner.name} gave friends +${buff} attack and +${buff} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DragonAbility {
    return new DragonAbility(newOwner, this.logService, this.abilityService);
  }
}
