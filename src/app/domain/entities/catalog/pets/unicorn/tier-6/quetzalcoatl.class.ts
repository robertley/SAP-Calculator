import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Quetzalcoatl extends Pet {
  name = 'Quetzalcoatl';
  tier = 6;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 8;
  initAbilities(): void {
    this.addAbility(
      new QuetzalcoatlAbility(this, this.logService, this.abilityService),
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


export class QuetzalcoatlAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'QuetzalcoatlAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const candidates = owner.parent.petArray.filter(
      (pet) => pet.alive && pet !== owner && pet.tier <= 3,
    );
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const triggers = this.level;
    for (let i = 0; i < triggers; i++) {
      const target =
        candidates[Math.floor(Math.random() * candidates.length)];
      target.increaseExp(2);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +2 experience.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: candidates.length > 1,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): QuetzalcoatlAbility {
    return new QuetzalcoatlAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


