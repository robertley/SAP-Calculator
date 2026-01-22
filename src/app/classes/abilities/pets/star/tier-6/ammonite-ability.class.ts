import { AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { PetAbility } from '../../pet-ability.class';
import {
  awardExperienceWithLog,
  transformPetWithLog,
} from '../../../ability-effects';

export class AmmoniteAbility extends PetAbility {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      owner,
      name: 'AmmoniteAbility',
      triggers: ['BeforeThisDies'],
    });
    this.logService = logService;
    this.petService = petService;
  }

  protected executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }
    let friendBehind = targetsBehindResp.pets[0];
    let rolls =
      owner.parent === gameApi.player
        ? gameApi.playerRollAmount
        : gameApi.opponentRollAmount;
    let expToGive = Math.floor(rolls / 2) * this.level;

    let mimicOctopus = this.petService.createPet(
      {
        name: 'Mimic Octopus',
        attack: friendBehind.attack,
        health: friendBehind.health,
        equipment: friendBehind.equipment,
        mana: friendBehind.mana,
        exp: null,
      },
      owner.parent,
    );

    transformPetWithLog({
      logService: this.logService,
      owner,
      context,
      fromPet: friendBehind,
      toPet: mimicOctopus,
      message: `${owner.name} transformed ${friendBehind.name} into ${mimicOctopus.name}`,
      extras: { randomEvent: targetsBehindResp.random },
    });

    let expTargetResp = owner.parent.getSpecificPet(owner, mimicOctopus);
    let target = expTargetResp.pet;
    if (target == null) {
      return;
    }
    awardExperienceWithLog({
      logService: this.logService,
      owner,
      context,
      target,
      amount: expToGive,
      extras: { randomEvent: expTargetResp.random },
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AmmoniteAbility {
    return new AmmoniteAbility(newOwner, this.logService, this.petService);
  }
}
