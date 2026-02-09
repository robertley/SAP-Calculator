import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { GameService } from 'app/runtime/state/game.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Popcorn } from 'app/domain/entities/catalog/equipment/star/popcorn.class';
import { Player } from '../../../player.class';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';


export class MicrowaveOven extends Toy {
  name = 'Microwave Oven';
  tier = 2;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let excludePets = this.parent.getPetsWithEquipment('Popcorn');
    let targetResp = this.parent.getFurthestUpPets(this.level, excludePets);
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} Popcorn.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
      pet.givePetEquipment(
        new Popcorn(this.logService, this.petService, this.gameService),
      );
    }
  }

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    parent: Player,
    level: number,
    private petService: PetService,
    private gameService: GameService,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class MicrowaveOvenAbility extends Ability {
  constructor(
    owner: Pet,
    logService: LogService,
    equipmentService: EquipmentService,
  ) {
    super({
      name: 'MicrowaveOvenAbility',
      triggers: ['StartBattle'],
      owner: owner,
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        const { puma } = context;
        let excludePets = owner.parent.getPetsWithEquipment('Popcorn');
        let targetResp = owner.parent.getFurthestUpPets(
          this.abilityLevel,
          excludePets,
          owner,
        );
        let targets = targetResp.pets;
        if (targets.length == 0) {
          return;
        }

        for (let pet of targets) {
          logService.createLog({
            message: `${owner.name} gave ${pet.name} Popcorn (Microwave Oven).`,
            type: 'ability',
            player: owner.parent,
            puma: puma,
          });
          const popcorn = equipmentService
            .getInstanceOfAllEquipment()
            .get('Popcorn');
          pet.givePetEquipment(popcorn);
        }
      },
    });
  }
}





