import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';


export class FarmerChicken extends Pet {
  name = 'Farmer Chicken';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FarmerChickenAbility(this, this.logService));
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


export class FarmerChickenAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FarmerChickenAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    let targetsResp = owner.parent.nearestPetsAhead(this.level, owner);
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (let target of targetsResp.pets) {
      target.givePetEquipment(new Corncob());
      this.logService.createLog({
        message: `${owner.name} fed ${target.name} a Corncob.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FarmerChickenAbility {
    return new FarmerChickenAbility(newOwner, this.logService);
  }
}
