import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';


export class FarmerCrow extends Pet {
  name = 'Farmer Crow';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 6;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FarmerCrowAbility(this, this.logService));
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


export class FarmerCrowAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Farmer Crow Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const friendCount = Math.min(owner.level, 3);
    const effectMultiplier = 3;
    const targetsResp = owner.parent.nearestPetsBehind(friendCount, owner);
    const targets = targetsResp.pets;

    for (const target of targets) {
      for (let i = 0; i < 3; i++) {
        const cob = new Corncob();
        cob.effectMultiplier = effectMultiplier;
        target.applyEquipment(cob);
      }
    }

    if (targets.length > 0) {
      this.logService.createLog({
        message: `${owner.name} fed Corncobs with ${effectMultiplier}x effect to ${targets.length} friend${targets.length === 1 ? '' : 's'}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FarmerCrowAbility {
    return new FarmerCrowAbility(newOwner, this.logService);
  }
}

