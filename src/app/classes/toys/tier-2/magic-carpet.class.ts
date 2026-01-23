import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../pet.class';
import { Toy } from '../../toy.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';


export class MagicCarpet extends Toy {
  name = 'Magic Carpet';
  tier = 2;
  friendSummoned(gameApi?: GameAPI, pet?: Pet, puma?: boolean, level?: number) {
    this.logService.createLog({
      message: `${this.name} gave ${pet.name} ${level} attack.`,
      type: 'ability',
      player: this.parent,
      puma: puma,
    });
    pet.increaseAttack(level);
  }
}


export class MagicCarpetAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MagicCarpetAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Mirror Magic Carpet toy behavior (friendSummoned method)
    // Note: This would need to be triggered when a pet is summoned
    // For now, we'll implement the effect as a general ability
    let pet = triggerPet || owner;
    this.logService.createLog({
      message: `Magic Carpet Ability gave ${pet.name} ${this.level} attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    pet.increaseAttack(this.level);

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MagicCarpetAbility {
    return new MagicCarpetAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
