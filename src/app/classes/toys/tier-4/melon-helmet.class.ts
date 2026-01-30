import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Melon } from 'app/classes/equipment/turtle/melon.class';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { LogService } from 'app/services/log.service';


export class MelonHelmet extends Toy {
  name = 'Melon Helmet';
  tier = 3;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    let targetPets = this.parent.petArray
      .filter((pet) => {
        return pet.alive;
      })
      .slice(0, this.level);
    for (let pet of targetPets) {
      pet.givePetEquipment(new Melon());
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Melon.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
    }
  }
}


export class MelonHelmetAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MelonHelmetAbility',
      owner: owner,
      triggers: ['Faint'],
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

    // Mirror Melon Helmet toy behavior (onBreak effect)
    let excludePets = owner.parent.getPetsWithEquipment('Melon');
    let targetsResp = owner.parent.getFurthestUpPets(
      this.level,
      excludePets,
      owner,
    );
    let targetPets = targetsResp.pets;
    for (let pet of targetPets) {
      pet.givePetEquipment(new Melon());
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Melon.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MelonHelmetAbility {
    return new MelonHelmetAbility(newOwner, this.logService);
  }
}


