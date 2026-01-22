import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Coconut } from '../../../../equipment/turtle/coconut.class';

export class WildebeestAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WildebeestAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.parent.trumpets >= 2;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    target.givePetEquipment(new Coconut());
    this.logService.createLog({
      message: `${owner.name} gave itself a Coconut.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    owner.parent.spendTrumpets(2, owner);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    super.reset();
    this.maxUses = this.level;
  }

  copy(newOwner: Pet): WildebeestAbility {
    return new WildebeestAbility(newOwner, this.logService);
  }
}
