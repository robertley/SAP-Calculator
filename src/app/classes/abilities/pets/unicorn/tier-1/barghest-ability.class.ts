import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Spooked } from '../../../../equipment/ailments/spooked.class';

export class BarghestAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BarghestAbility',
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

    // Get pets that have equipment (non-ailments) to exclude them (we want perk-less pets)
    let petsWithPerks = owner.parent.opponent.getPetsWithEquipment('perk');
    let petsWithSpooked = owner.parent.opponent.getPetsWithEquipment('Spooked');
    let excludePets = [...petsWithPerks, ...petsWithSpooked];
    let targetsResp = owner.parent.opponent.getLastPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Spooked`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });

      target.givePetEquipment(new Spooked());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BarghestAbility {
    return new BarghestAbility(newOwner, this.logService);
  }
}
