import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pony extends Pet {
  name = 'Pony';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new PonyAbility(this, this.logService));
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


export class PonyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Pony Ability',
      owner: owner,
      triggers: ['KnockOut'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const player = owner.parent;
    const apples = this.level;
    const target = owner.petBehind();

    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    const abilityService = (player as any).abilityService as AbilityService;

    for (let i = 0; i < apples; i++) {
      this.applyBetterApple(target, abilityService);
    }

    this.logService.createLog({
      message: `${owner.name} fed ${target.name} ${apples} Better Apple${apples === 1 ? '' : 's'} after knocking out an enemy.`,
      type: 'ability',
      player: player,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  private applyBetterApple(target: Pet, abilityService?: AbilityService): void {
    target.increaseAttack(2);
    target.increaseHealth(2);
    abilityService?.triggerFoodEvents(target, 'better apple');
  }

  override copy(newOwner: Pet): PonyAbility {
    return new PonyAbility(newOwner, this.logService);
  }
}
