import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';


export class FarmerDog extends Pet {
  name = 'Farmer Dog';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 5;
  health = 6;
  initAbilities(): void {
    this.addAbility(new FarmerDogAbility(this, this.logService));
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


export class FarmerDogAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Farmer Dog Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const effectMultiplier = this.level;
    const friends = owner.parent.petArray.filter(
      (pet) => pet && pet.alive && pet !== owner,
    );
    if (friends.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const friend of friends) {
      const cob = new Corncob();
      cob.effectMultiplier = effectMultiplier;
      friend.givePetEquipment(cob);
    }

    this.logService.createLog({
      message: `${owner.name} fed ${effectMultiplier} Corncob${effectMultiplier === 1 ? '' : 's'} to ${friends.length} friend${friends.length === 1 ? '' : 's'}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FarmerDogAbility {
    return new FarmerDogAbility(newOwner, this.logService);
  }
}
