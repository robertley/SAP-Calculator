import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { PetService } from 'app/services/pet/pet.service';
import { InjectorService } from 'app/services/injector.service';
import { levelToExp } from 'app/util/leveling';


export class Tadpole extends Pet {
  name = 'Tadpole';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 2;

  override initAbilities(): void {
    this.addAbility(new TadpoleAbility(this, this.logService, this.petService));
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


export class TadpoleAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'Tadpole Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const level = owner.level;

    // Create a new Frog
    const frog = this.petService.createPet(
      {
        name: 'Frog',
        attack: null,
        health: null,
        mana: 0,
        exp: levelToExp(level),
        equipment: null,
      },
      owner.parent,
    );

    if (frog) {
      // Transformation
      owner.parent.transformPet(owner, frog);

      this.logService.createLog({
        message: `${owner.name} transformed into a level ${level} Frog.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): TadpoleAbility {
    return new TadpoleAbility(newOwner, this.logService, this.petService);
  }
}
