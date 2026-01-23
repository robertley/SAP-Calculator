import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Leviathan extends Pet {
  name = 'Leviathan';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 10;
  initAbilities(): void {
    this.addAbility(
      new LeviathanAbility(this, this.logService, this.petService),
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


export class LeviathanAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'LeviathanAbility',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { tiger, pteranodon } = context;

    const power = this.level * 6;
    const expGain = this.level * 2;
    const fish = this.petService.createPet(
      {
        name: 'Fish',
        attack: power,
        health: power,
        mana: 0,
        exp: 0,
        equipment: null,
        triggersConsumed: 0,
      },
      owner.parent,
    );

    fish.increaseExp(expGain);
    const summonResult = owner.parent.summonPet(
      fish,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned ${fish.name} (${power}/${power}) and granted ${expGain} exp.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LeviathanAbility {
    return new LeviathanAbility(newOwner, this.logService, this.petService);
  }
}
