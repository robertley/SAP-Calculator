import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { Toy } from '../../../toy.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Pet } from '../../../pet.class';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Player } from '../../../player.class';


export class CashRegister extends Toy {
  name = 'Cash Register';
  tier = 4;
  onBreak(gameApi?: GameAPI, puma?: boolean) {
    const power = this.level * 7;
    const sellValue = this.level * 4;
    const goldFish = this.petService.createPet(
      {
        name: 'Gold Fish',
        attack: power,
        health: power,
        exp: 0,
        mana: 0,
        equipment: null,
      },
      this.parent,
    );
    goldFish.toyPet = true;
    goldFish.baseSellValue = sellValue;
    goldFish.sellValue = sellValue;

    if (this.parent.summonPet(goldFish, 0).success) {
      this.logService.createLog({
        message: `${this.name} spawned Gold Fish (${power}/${power}) that sells for ${sellValue} gold.`,
        type: 'ability',
        player: this.parent,
        puma,
      });
    }
  }

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    private petService: PetService,
    parent: Player,
    level: number,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class CashRegisterAbility extends Ability {
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CashRegisterAbility',
      triggers: [],
      owner: owner,
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        // Placeholder for Cash Register ability
      },
    });
  }
}



