import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Spooked } from 'app/classes/equipment/ailments/spooked.class';

export class TasmanianDevilAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TasmanianDevilAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetResp = owner.parent.opponent.getLowestAttackPet(undefined, owner);

    if (targetResp.pet && targetResp.pet.alive) {
      let spookedAilment = new Spooked();
      spookedAilment.multiplier += this.level * 5 - 1;
      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} ${spookedAilment.multiplier}x Spooked.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
      targetResp.pet.givePetEquipment(spookedAilment);
      owner.jumpAttackPrep(targetResp.pet);
      owner.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TasmanianDevilAbility {
    return new TasmanianDevilAbility(newOwner, this.logService);
  }
}
