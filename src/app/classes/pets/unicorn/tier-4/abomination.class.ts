import { AbilityService } from '../../../../services/ability/ability.service';
import { LogService } from '../../../../services/log.service';
import { PetService } from '../../../../services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { AbominationAbility } from '../../../abilities/pets/unicorn/tier-4/abomination-ability.class';

export class Abomination extends Pet {
  name = 'Abomination';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 6;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new AbominationAbility(this, this.logService, this.petService),
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
    abominationSwallowedPet1?: string,
    abominationSwallowedPet2?: string,
    abominationSwallowedPet3?: string,
    abominationSwallowedPet1Level?: number,
    abominationSwallowedPet2Level?: number,
    abominationSwallowedPet3Level?: number,
    abominationSwallowedPet1TimesHurt?: number,
    abominationSwallowedPet2TimesHurt?: number,
    abominationSwallowedPet3TimesHurt?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.abominationSwallowedPet1 = abominationSwallowedPet1;
    this.abominationSwallowedPet2 = abominationSwallowedPet2;
    this.abominationSwallowedPet3 = abominationSwallowedPet3;
    this.abominationSwallowedPet1Level = abominationSwallowedPet1Level ?? 1;
    this.abominationSwallowedPet2Level = abominationSwallowedPet2Level ?? 1;
    this.abominationSwallowedPet3Level = abominationSwallowedPet3Level ?? 1;
    this.abominationSwallowedPet1TimesHurt =
      abominationSwallowedPet1TimesHurt ?? 0;
    this.abominationSwallowedPet2TimesHurt =
      abominationSwallowedPet2TimesHurt ?? 0;
    this.abominationSwallowedPet3TimesHurt =
      abominationSwallowedPet3TimesHurt ?? 0;
  }
}
