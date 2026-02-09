import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { hasSilly } from 'app/domain/entities/player/player-utils';
import { getRandomInt } from 'app/runtime/random';


export class SpiderCrab extends Pet {
  name = 'Spider Crab';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 1;
  health = 5;
  initAbilities(): void {
    this.addAbility(new SpiderCrabAbility(this, this.logService));
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


export class SpiderCrabAbility extends Ability {
  private logService: LogService;
  private affectedPets = new Set<Pet>();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Spider Crab Ability',
      owner: owner,
      triggers: ['FriendAttacked', 'StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { triggerPet, tiger, pteranodon } = context;

    if (context.trigger === 'StartTurn') {
      this.affectedPets.clear();
      this.triggerTigerExecution(context);
      return;
    }

    if (!triggerPet || triggerPet.parent !== owner.parent) {
      this.triggerTigerExecution(context);
      return;
    }

    if (!triggerPet.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.has(triggerPet)) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.affectedPets.size >= this.level) {
      this.triggerTigerExecution(context);
      return;
    }

    let target = triggerPet;
    if (hasSilly(owner)) {
      const candidates = owner.parent.petArray.filter((pet) => pet.alive);
      if (candidates.length === 0) {
        this.triggerTigerExecution(context);
        return;
      }
      target = candidates[getRandomInt(0, candidates.length - 1)];
    }

    target.increaseHealth(4);
    target.parent.pushPetToBack(target);
    this.affectedPets.add(triggerPet);

    this.logService.createLog({
      message: `${owner.name} moved ${target.name} to the back and gave it +4 health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SpiderCrabAbility {
    return new SpiderCrabAbility(newOwner, this.logService);
  }
}






