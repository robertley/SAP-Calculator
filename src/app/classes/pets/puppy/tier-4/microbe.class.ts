import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Weak } from 'app/classes/equipment/ailments/weak.class';


export class Microbe extends Pet {
  name = 'Microbe';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 1;
  initAbilities(): void {
    this.addAbility(new MicrobeAbility(this, this.logService));
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


export class MicrobeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MicrobeAbility',
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

    let targetsResp = owner.parent.getPetsWithinXSpaces(owner, this.level * 3);
    let targets = targetsResp.pets.filter(
      (pet) => pet.equipment?.name !== 'Weak',
    );
    if (targets.length == 0) {
      return;
    }
    for (let pet of targets) {
      if (!pet.alive) {
        continue;
      }
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
      pet.givePetEquipment(new Weak());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MicrobeAbility {
    return new MicrobeAbility(newOwner, this.logService);
  }
}

