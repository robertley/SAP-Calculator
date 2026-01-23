import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Amargasaurus extends Pet {
  name = 'Amargasaurus';
  tier = 5;
  pack: Pack = 'Star';
  attack = 5;
  health = 7;
  initAbilities(): void {
    this.addAbility(new AmargasaurusAbility(this, this.logService));
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


export class AmargasaurusAbility extends Ability {
  private logService: LogService;
  private healthRestoredThisTurn: number = 0;

  reset(): void {
    this.healthRestoredThisTurn = 0;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AmargasaurusAbility',
      owner: owner,
      triggers: ['FriendHurt', 'StartTurn'],
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

    if (context.trigger === 'StartTurn') {
      this.healthRestoredThisTurn = 0;
      return;
    }

    const { gameApi, triggerPet, tiger, pteranodon } = context;

    let currentTargetPet: Pet;
    if (!triggerPet) {
      return;
    }
    // Special handling ONLY for Fairy Armadillo to account for its transformation.
    if (triggerPet.transformed) {
      currentTargetPet = triggerPet.transformedInto;
      currentTargetPet.originalHealth = triggerPet.originalHealth;
    } else {
      currentTargetPet = triggerPet;
    }

    if (!currentTargetPet || !currentTargetPet.alive) {
      return;
    }

    if (currentTargetPet === owner) {
      return;
    }

    const maxHealthToRestore = this.level * 15;
    const healthMissing =
      currentTargetPet.originalHealth - currentTargetPet.health;

    if (
      healthMissing <= 0 ||
      this.healthRestoredThisTurn >= maxHealthToRestore
    ) {
      return;
    }

    const remainingRestorePower =
      maxHealthToRestore - this.healthRestoredThisTurn;
    const healthToRestore = Math.min(healthMissing, remainingRestorePower);

    if (healthToRestore > 0) {
      let targetResp = owner.parent.getSpecificPet(owner, currentTargetPet);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }
      this.logService.createLog({
        message: `${owner.name} restored ${healthToRestore} health to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });

      target.increaseHealth(healthToRestore);
      this.healthRestoredThisTurn += healthToRestore;
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmargasaurusAbility {
    return new AmargasaurusAbility(newOwner, this.logService);
  }
}
