import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Sunfish extends Pet {
  name = 'Sunfish';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 4;
  health = 10;
  initAbilities(): void {
    this.addAbility(new SunfishAbility(this, this.logService));
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


export class SunfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SunfishAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { gameApi, tiger, pteranodon } = context;
    const turnNumber = gameApi?.turnNumber ?? 1;

    if (turnNumber % 2 === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const damage = this.level * 4;
    const targetsResp = owner.parent.nearestPetsAhead(5, owner, undefined, true);
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const target of targets) {
      owner.dealDamage(target, damage);
    }

    const names = targets.map((pet) => pet.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} hit ${names} ahead for ${damage} damage because turn ${turnNumber} is odd.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SunfishAbility {
    return new SunfishAbility(newOwner, this.logService);
  }
}
