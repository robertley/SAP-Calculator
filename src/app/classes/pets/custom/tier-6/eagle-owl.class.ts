import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class EagleOwl extends Pet {
  name = 'Eagle Owl';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 8;
  health = 3;
  initAbilities(): void {
    this.addAbility(new EagleOwlAbility(this, this.logService));
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


export class EagleOwlAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Eagle Owl Ability',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const battles = Math.max(0, owner.battlesFought ?? 0);
    if (battles <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const buffPerBattle = this.level;
    const totalBuff = battles * buffPerBattle;
    const targetResp = owner.parent.getRandomPets(
      3,
      [owner],
      true,
      false,
      owner,
    );
    const targets = targetResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const target of targets) {
      target.increaseAttack(totalBuff);
      target.increaseHealth(totalBuff);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${totalBuff}/+${totalBuff} after fighting ${battles} battle${battles === 1 ? '' : 's'}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): EagleOwlAbility {
    return new EagleOwlAbility(newOwner, this.logService);
  }
}
