import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Corncob } from 'app/classes/equipment/custom/corncob.class';


export class FarmerPig extends Pet {
  name = 'Farmer Pig';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new FarmerPigAbility(this, this.logService));
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


export class FarmerPigAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Farmer Pig Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const friends = [owner.petAhead, owner.petBehind()].filter(
      (p) => p !== null && p.alive,
    );

    for (const friend of friends) {
      for (let i = 0; i < this.level; i++) {
        const cob = new Corncob();
        cob.effectMultiplier = 2;
        friend.givePetEquipment(cob);
      }
    }

    if (friends.length > 0) {
      this.logService.createLog({
        message: `${owner.name} fed adjacent friends ${this.level} Corncob${this.level === 1 ? '' : 's'} with double effect.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): FarmerPigAbility {
    return new FarmerPigAbility(newOwner, this.logService);
  }
}
