import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { PetService } from 'app/integrations/pet/pet.service';
import { Toy } from '../../../toy.class';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { Player } from '../../../player.class';


export class RubberDuck extends Toy {
  name = 'Rubber Duck';
  tier = 1;

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    private petService: PetService,
    parent: Player,
    level: number,
  ) {
    super(logService, toyService, parent, level);
  }

  allEnemiesFainted(gameApi?: GameAPI, puma?: boolean) {
    if (this.used) {
      return;
    }
    const opponent = this.parent.opponent;
    const duck = this.petService.createPet(
      {
        name: 'Duck',
        attack: 50,
        health: 1,
        exp: 0,
        mana: 0,
        equipment: null,
      },
      opponent,
    );
    duck.toyPet = true;

    if (opponent.summonPet(duck, 0).success) {
      this.logService.createLog({
        message: `${this.name} summoned a 50/1 Duck for the enemy.`,
        type: 'ability',
        player: this.parent,
        puma: puma,
      });
      this.used = true;
    }
  }
}

