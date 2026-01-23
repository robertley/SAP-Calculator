import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Stegosaurus extends Pet {
  name = 'Stegosaurus';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 8;
  initAbilities(): void {
    this.addAbility(new StegosaurusAbility(this, this.logService));
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


export class StegosaurusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'StegosaurusAbility',
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
    const buffAmount = this.level * 10;
    const target = owner.parent.petArray.find(
      (pet) => pet && pet !== owner && pet.alive && !pet.equipment,
    );

    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    target.increaseAttack(buffAmount);
    target.increaseHealth(buffAmount);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buffAmount}/+${buffAmount} at start of battle.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): StegosaurusAbility {
    return new StegosaurusAbility(newOwner, this.logService);
  }
}
