import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { getOpponent } from '../../../../../util/helper-functions';

export class RaccoonAbility extends Ability {
  private logService: LogService;

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RaccoonAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
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
    let target = opponent.getPetAtPosition(0);
    if (target == null) {
      return;
    }
    if (target.equipment == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} stole ${target.name}'s equipment. (${target.equipment.name})`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    owner.givePetEquipment(target.equipment);
    target.removePerk();

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RaccoonAbility {
    return new RaccoonAbility(newOwner, this.logService);
  }
}
