import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Eucalyptus } from 'app/domain/entities/catalog/equipment/puppy/eucalyptus.class';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';


export class PlasticSaw extends Toy {
  name = 'Plastic Saw';
  tier = 2;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let excludePets = this.parent.getPetsWithEquipment('Eucalyptus');
    let targetResp = this.parent.getFurthestUpPets(this.level, excludePets);
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Eucalyptus.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
      pet.givePetEquipment(new Eucalyptus());
    }
  }
}


export class PlasticSawAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PlasticSawAbility',
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
    const { gameApi, triggerPet, tiger } = context;
    const owner = this.owner;

    // Mirror Plastic Saw toy behavior
    let excludePets = owner.parent.getPetsWithEquipment('Eucalyptus');
    let targetResp = owner.parent.getFurthestUpPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Eucalyptus.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
      pet.givePetEquipment(new Eucalyptus());
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PlasticSawAbility {
    return new PlasticSawAbility(newOwner, this.logService);
  }
}




