import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BabyUrchin extends Pet {
  name = 'Baby Urchin';
  tier = 2;
  pack: Pack = 'Star';
  attack = 2;
  health = 1;

  initAbilities(): void {
    this.addAbility(new BabyUrchinAbility(this, this.logService));
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


export class BabyUrchinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BabyUrchinAbility',
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

    let firstTargetResp = owner.parent.opponent.getFurthestUpPet(owner);
    let targets = [firstTargetResp.pet];
    let isRandom = firstTargetResp.random;
    if (!targets[0]) {
      return;
    }

    for (let i = 0; i < owner.level - 1; i++) {
      let target: Pet;
      if (isRandom) {
        // If Silly, get new random target for each additional hit
        let nextTargetResp = owner.parent.opponent.getFurthestUpPet(owner);
        target = nextTargetResp.pet;
        // Keep using isRandom = true for all targets when Silly
      } else {
        // Normal behavior - target behind current target
        let currTarget = targets[i];
        target = currTarget.petBehind();
      }

      if (!target) {
        break;
      }
      targets.push(target);
    }

    for (let target of targets) {
      if (target) {
        target.increaseHealth(-4);
        this.logService.createLog({
          message: `${owner.name} removed 4 health from ${target.name}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: isRandom,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BabyUrchinAbility {
    return new BabyUrchinAbility(newOwner, this.logService);
  }
}

