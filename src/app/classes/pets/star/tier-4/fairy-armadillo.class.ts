import { cloneDeep } from 'lodash-es';
import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { FairyBall } from '../../hidden/fairy-ball.class';
import { FairyArmadilloAbility } from '../../../abilities/pets/star/tier-4/fairy-armadillo-ability.class';

export class FairyArmadillo extends Pet {
  name = 'Fairy Armadillo';
  tier = 4;
  pack: Pack = 'Star';
  attack = 2;
  health = 6;

  initAbilities(): void {
    this.addAbility(
      new FairyArmadilloAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}
