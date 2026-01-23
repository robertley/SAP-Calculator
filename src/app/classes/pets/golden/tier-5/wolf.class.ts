import { Power } from 'app/interfaces/power.interface';
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Wolf extends Pet {
  name = 'Wolf';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 4;
  health = 4;
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
  initAbilities(): void {
    this.addAbility(
      new WolfAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }
}


export class WolfAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'WolfAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power: Power = {
      attack: this.level * 3,
      health: this.level * 2,
    };

    for (let i = 0; i < 3; i++) {
      let pig = this.petService.createPet(
        {
          attack: power.attack,
          equipment: null,
          exp: owner.minExpForLevel,
          health: power.health,
          name: 'Pig',
          mana: 0,
        },
        owner.parent,
      );

      let summonResult = owner.parent.summonPet(
        pig,
        owner.savedPosition,
        false,
        owner,
      );

      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned ${pig.name} ${power.attack}/${power.health}`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WolfAbility {
    return new WolfAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}
