import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';
import { Walnut } from 'app/domain/entities/catalog/equipment/puppy/walnut.class';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';


export class Stick extends Toy {
  name = 'Stick';
  tier = 1;

  constructor(
    protected logService: LogService,
    protected toyService: any,
    parent: any,
    level: number,
    private petService?: PetService,
  ) {
    super(logService, toyService, parent, level);
  }

  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    // Give Walnut perk to the friend on the middle space.
    const friendResp = this.parent.getMiddleFriend();
    if (friendResp.pet && friendResp.pet.alive) {
      const walnut = new Walnut();
      walnut.power = 2 * this.level;
      walnut.originalPower = walnut.power;
      friendResp.pet.givePetEquipment(walnut);
      this.logService.createLog({
        message: `${this.name} gave Walnut to ${friendResp.pet.name}`,
        type: 'ability',
        player: this.parent,
        randomEvent: friendResp.random,
      });
    }
  }
}


export class StickAbility extends Ability {
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'StickAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        const { gameApi } = context;
        // Give Walnut perk to the friend on the middle space.
        const friendResp = owner.parent.getMiddleFriend(owner);
        if (friendResp.pet && friendResp.pet.alive) {
          const walnut = new Walnut();
          walnut.power = 2 * this.abilityLevel;
          walnut.originalPower = walnut.power;
          friendResp.pet.givePetEquipment(walnut);
          logService.createLog({
            message: `${owner.name} gave Walnut to ${friendResp.pet.name} (Stick)`,
            type: 'ability',
            player: owner.parent,
            randomEvent: friendResp.random,
          });
        }
      },
    });
  }
}




