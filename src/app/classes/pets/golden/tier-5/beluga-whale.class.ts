import { cloneDeep } from 'lodash-es';
import { GameAPI } from '../../../../interfaces/gameAPI.interface';
import { Power } from '../../../../interfaces/power.interface';
import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from '../../../../services/pet/pet.service';
import { BelugaWhaleAbility } from '../../../abilities/pets/golden/tier-5/beluga-whale-ability.class';

export class BelugaWhale extends Pet {
  name = 'Beluga Whale';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 3;
  health = 8;
  initAbilities(): void {
    this.addAbility(
      new BelugaWhaleAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
    swallowedPet?: string | null,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.belugaSwallowedPet = swallowedPet ?? null;
  }
}
