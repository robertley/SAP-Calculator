import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class HatchingChick extends Pet {
  name = 'Hatching Chick';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new HatchingChickAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
  // endTurn(gameApi: GameAPI): void {
  //     if (this.level > 1) {
  //         return;
  //     }
  //     let target = this.petAhead;
  //     if (target == null) {
  //         return;
  //     }

  //     target.increaseAttack(3);
  //     target.increaseHealth(3);
  //     this.logService.createLog({
  //         message: `${this.name} gave ${target.name} ${3} attack and ${3} health.`,
  //         type: 'ability',
  //         player: this.parent
  //     })
  // }
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


export class HatchingChickAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private pendingBuffs: Map<Pet, { attack: number; health: number }> =
    new Map();

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'HatchingChickAbility',
      owner: owner,
      triggers: ['EndTurn', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      for (const [pet, buff] of this.pendingBuffs) {
        if (pet) {
          pet.increaseAttack(-buff.attack);
          pet.increaseHealth(-buff.health);
        }
      }
      this.pendingBuffs.clear();
      this.triggerTigerExecution(context);
      return;
    }

    const target = owner.petAhead;
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    if (this.level === 1) {
      const attackGain = 3;
      const healthGain = 3;
      target.increaseAttack(attackGain);
      target.increaseHealth(healthGain);
      this.pendingBuffs.set(target, { attack: attackGain, health: healthGain });
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${attackGain}/+${healthGain} until next turn.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
      this.triggerTigerExecution(context);
      return;
    }

    if (this.level === 2) {
      const buff = 2;
      target.increaseAttack(buff);
      target.increaseHealth(buff);
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${buff}/+${buff}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
      this.triggerTigerExecution(context);
      return;
    }

    target.increaseExp(1);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +1 experience.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HatchingChickAbility {
    return new HatchingChickAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
