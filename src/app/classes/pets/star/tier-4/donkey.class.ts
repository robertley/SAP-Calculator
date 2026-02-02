import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Donkey extends Pet {
  name = 'Donkey';
  tier = 4;
  pack: Pack = 'Star';
  attack = 4;
  health = 6;

  initAbilities(): void {
    this.addAbility(new DonkeyAbility(this, this.logService));
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


// Friend faints: Push the last enemy to the front and remove 3 attack.

export class DonkeyAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DonkeyAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let opponent = owner.parent.opponent;
    let targetResp = opponent.getLastPet();
    if (targetResp.pet == null) {
      return;
    }
    opponent.pushPet(targetResp.pet, targetResp.pet.position);

    targetResp.pet.increaseAttack(-3);

    this.logService.createLog({
      message: `${owner.name} pushed ${targetResp.pet.name} to the front and removed 3 attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DonkeyAbility {
    return new DonkeyAbility(newOwner, this.logService);
  }
}

