import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Poodle extends Pet {
  name = 'Poodle';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 2;

  initAbilities(): void {
    this.addAbility(new PoodleAbility(this, this.logService));
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


export class PoodleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PoodleAbility',
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
    const { tiger, pteranodon } = context;
    const touched: Pet[] = [];

    for (let tier = 1; tier <= 6; tier++) {
      const target = owner.parent.petArray.find(
        (pet) => pet && pet.alive && pet !== owner && pet.tier === tier,
      );
      if (!target) {
        continue;
      }
      const amount = this.level;
      target.increaseAttack(amount);
      target.increaseHealth(amount);
      touched.push(target);
    }

    if (touched.length > 0) {
      const names = touched.map((p) => p.name).join(', ');
      this.logService.createLog({
        message: `${owner.name} buffed ${names} (+${this.level}/+${this.level}) at end of turn.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PoodleAbility {
    return new PoodleAbility(newOwner, this.logService);
  }
}


