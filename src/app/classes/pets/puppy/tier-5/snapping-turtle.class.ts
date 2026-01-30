import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Skewer } from 'app/classes/equipment/puppy/skewer.class';


export class SnappingTurtle extends Pet {
  name = 'Snapping Turtle';
  tier = 5;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(new SnappingTurtleAbility(this, this.logService));
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


export class SnappingTurtleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SnappingTurtleAbility',
      owner: owner,
      triggers: ['Faint'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let excludePets = owner.parent.getPetsWithEquipment('Skewer');
    let targetsBehindResp = owner.parent.nearestPetsBehind(
      owner.level,
      owner,
      excludePets,
    );
    if (targetsBehindResp.pets.length === 0) {
      return;
    }

    for (let pet of targetsBehindResp.pets) {
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Skewer.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
      pet.givePetEquipment(new Skewer(this.logService));
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SnappingTurtleAbility {
    return new SnappingTurtleAbility(newOwner, this.logService);
  }
}

