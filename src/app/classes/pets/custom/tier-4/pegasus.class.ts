import { Pet } from '../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Pegasus extends Pet {
  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
  ) {
    super(logService, abilityService, parent);
    this.name = 'Pegasus';
    this.tier = 4;
    this.pack = 'Custom';
    this.attack = 2;
    this.health = 4;
  }

  override initAbilities(): void {
    this.abilityList = [new PegasusAbility(this, this.logService)];
    super.initAbilities();
  }
}


export class PegasusAbility extends Ability {
  private logService: LogService;
  private pendingBuffs: Map<Pet, number> = new Map();

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Pegasus Ability',
      owner: owner,
      triggers: ['FriendSummoned', 'EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { trigger, tiger, pteranodon } = context;
    const owner = this.owner;

    if (trigger === 'FriendSummoned') {
      const targetsResp = owner.parent.getRandomPets(
        3,
        [],
        false,
        false,
        owner,
      );
      const buffAmount = this.level;

      if (targetsResp.pets.length > 0) {
        const names = [];
        for (const target of targetsResp.pets) {
          target.increaseAttack(buffAmount);
          const previousBuff = this.pendingBuffs.get(target) ?? 0;
          this.pendingBuffs.set(target, previousBuff + buffAmount);
          names.push(target.name);
        }

        this.logService.createLog({
          message: `${owner.name} temporarily buffed ${names.join(', ')} for +${buffAmount} attack until next turn.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: targetsResp.random,
        });
      }
    } else if (trigger === 'EndTurn') {
      this.resetBuffs();
    }

    this.triggerTigerExecution(context);
  }

  private resetBuffs(): void {
    for (const [pet, amount] of this.pendingBuffs) {
      if (pet.alive) {
        pet.increaseAttack(-amount);
      }
    }
    this.pendingBuffs.clear();
  }

  override copy(newOwner: Pet): PegasusAbility {
    return new PegasusAbility(newOwner, this.logService);
  }
}
