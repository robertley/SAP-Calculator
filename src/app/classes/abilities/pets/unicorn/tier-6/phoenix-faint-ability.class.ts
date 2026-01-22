import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Crisp } from '../../../../equipment/ailments/crisp.class';

export class PhoenixFaintAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PhoenixFaintAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let cripsAmt = this.level * 3;
    // Exclude pets that already have Crisp
    let allPets = [...owner.parent.petArray, ...owner.parent.opponent.petArray];
    let petsWithCrisp = allPets.filter((pet) => pet.equipment instanceof Crisp);

    let targetsResp = owner.parent.getRandomPets(
      cripsAmt,
      petsWithCrisp,
      true,
      true,
      owner,
      true,
    );
    let targets = targetsResp.pets;

    if (targets.length > 0) {
      for (let target of targets) {
        this.logService.createLog({
          message: `${owner.name} gave ${target.name} Crisp.`,
          type: 'ability',
          randomEvent: targetsResp.random,
          tiger: tiger,
          player: owner.parent,
        });

        target.givePetEquipment(new Crisp());
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PhoenixFaintAbility {
    return new PhoenixFaintAbility(newOwner, this.logService);
  }
}
