import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PaintedTerrapinAbility } from '../../../abilities/pets/danger/tier-5/painted-terrapin-ability.class';

export class PaintedTerrapin extends Pet {
  name = 'Painted Terrapin';
  tier = 5;
  pack: Pack = 'Danger';
  health = 6;
  attack = 4;

  initAbilities(): void {
    this.addAbility(new PaintedTerrapinAbility(this, this.logService));
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
