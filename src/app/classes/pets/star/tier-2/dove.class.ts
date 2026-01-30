import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Dove extends Pet {
  name = 'Dove';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 1;

  initAbilities(): void {
    this.addAbility(new DoveAbility(this, this.logService));
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


export class DoveAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DoveAbility',
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

    let excludePets = owner.parent.petArray.filter((pet) => {
      return pet == owner || pet.equipment?.name != 'Strawberry';
    });
    let targetResp = owner.parent.getRandomPets(
      3,
      excludePets,
      null,
      null,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      if (target.equipment.name != 'Strawberry') {
        continue;
      }
      this.logService.createLog({
        message: `${owner.name} activated ${target.name}'s Strawberry.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
        pteranodon: pteranodon,
      });

      let backMostPetResp = target.parent.getLastPet(null, target);
      let backMostPet = backMostPetResp.pet;
      let power = this.level + backMostPet.equipment.multiplier - 1;
      backMostPet.increaseAttack(power);
      backMostPet.increaseHealth(power);
      this.logService.createLog({
        message: `${target.name} gave ${backMostPet.name} ${power} attack ${power} health (Strawberry) (x${this.level} ${owner.name}).`,
        type: 'equipment',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DoveAbility {
    return new DoveAbility(newOwner, this.logService);
  }
}

