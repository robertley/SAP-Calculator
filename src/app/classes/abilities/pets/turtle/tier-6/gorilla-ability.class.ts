import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Coconut } from '../../../../equipment/turtle/coconut.class';

export class GorillaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GorillaAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.alive;
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
      message: `${owner.name} gave ${target.name} a Coconut.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  copy(newOwner: Pet): GorillaAbility {
    const newAbility = new GorillaAbility(newOwner, this.logService);
    // Update maxUses based on new owner's level
    newAbility.maxUses = newOwner.level;
    return newAbility;
  }
}
