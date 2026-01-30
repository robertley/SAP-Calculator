import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Lusca extends Pet {
  name = 'Lusca';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 7;
  health = 5;
  initAbilities(): void {
    this.addAbility(new LuscaAbility(this, this.logService));
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


export class LuscaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Lusca Ability',
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
    const manaSpent = owner.mana;
    if (manaSpent <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.mana = 0;
    const targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      [],
      false,
      false,
      owner,
    );
    const targets = targetResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const target of targets) {
      const reduction = manaSpent;
      const attackAfter = Math.max(0, target.attack - reduction);
      const healthAfter = Math.max(0, target.health - reduction);
      target.attack = attackAfter;
      target.health = Math.max(1, healthAfter);
    }

    this.logService.createLog({
      message: `${owner.name} spent ${manaSpent} mana and drained ${targets.map((pet) => pet.name).join(', ')}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LuscaAbility {
    return new LuscaAbility(newOwner, this.logService);
  }
}

