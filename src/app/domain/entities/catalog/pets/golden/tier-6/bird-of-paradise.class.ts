import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class BirdOfParadise extends Pet {
  name = 'Bird of Paradise';
  tier = 6;
  pack: Pack = 'Golden';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new BirdOfParadiseAbility(this, this.logService, this.abilityService),
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


export class BirdOfParadiseAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;
  private readonly maxUsesPerTurn = 3;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BirdOfParadiseAbility',
      owner: owner,
      triggers: ['SpendGold7', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= this.maxUsesPerTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    const owner = this.owner;
    const targetsResp = owner.parent.getRandomPets(3, [owner]);
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const buff = this.level;
    for (const target of targets) {
      target.increaseAttack(buff);
      target.increaseHealth(buff);
    }
    this.usesThisTurn++;

    this.logService.createLog({
      message: `${owner.name} gave ${targets.map((pet) => pet.name).join(', ')} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetsResp.random,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BirdOfParadiseAbility {
    return new BirdOfParadiseAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


