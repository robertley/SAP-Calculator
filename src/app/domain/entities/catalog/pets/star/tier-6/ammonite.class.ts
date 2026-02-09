import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { awardExperienceWithLog, transformPetWithLog } from 'app/domain/entities/ability-effects';


export class Ammonite extends Pet {
  name = 'Ammonite';
  tier = 6;
  pack: Pack = 'Star';
  attack = 5;
  health = 3;

  initAbilities(): void {
    this.addAbility(
      new AmmoniteAbility(this, this.logService, this.petService),
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
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


export class AmmoniteAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'AmmoniteAbility',
      owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      abilityFunction: (context: AbilityContext) => {
        this.executeAbility(context);
      },
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




