import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { ChimeraLion } from '../../../../pets/hidden/chimera-lion.class';
import { ChimeraGoat } from '../../../../pets/hidden/chimera-goat.class';
import { ChimeraSnake } from '../../../../pets/hidden/chimera-snake.class';

export class ChimeraAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ChimeraAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    const manaSpent = owner.mana;
    const buffMultiplier = Math.floor(manaSpent / 2);
    const bonusAttack = buffMultiplier * 1;
    const bonusHealth = buffMultiplier * 2;

    const finalAttack = 3 + bonusAttack;
    const finalHealth = 3 + bonusHealth;

    if (manaSpent > 0) {
      this.logService.createLog({
        message: `${owner.name} spent ${manaSpent} mana.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Always spawn Lion
    let lion = new ChimeraLion(
      this.logService,
      this.abilityService,
      owner.parent,
      finalHealth,
      finalAttack,
    );
    let lionSummonResult = owner.parent.summonPet(
      lion,
      owner.savedPosition,
      false,
      owner,
    );
    if (lionSummonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned a ${lion.name} ${finalAttack}/${finalHealth}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: lionSummonResult.randomEvent,
      });
    }

    if (this.level >= 2) {
      // Spawn Goat at level 2+
      let goat = new ChimeraGoat(
        this.logService,
        this.abilityService,
        owner.parent,
        finalHealth,
        finalAttack,
      );
      let goatSummonResult = owner.parent.summonPet(
        goat,
        owner.savedPosition,
        false,
        owner,
      );
      if (goatSummonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a ${goat.name} ${finalAttack}/${finalHealth}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: goatSummonResult.randomEvent,
        });
      }
    }

    if (this.level >= 3) {
      // Spawn Snake at level 3
      let snake = new ChimeraSnake(
        this.logService,
        this.abilityService,
        owner.parent,
        finalHealth,
        finalAttack,
      );
      let snakeSummonResult = owner.parent.summonPet(
        snake,
        owner.savedPosition,
        false,
        owner,
      );
      if (snakeSummonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned a ${snake.name} ${finalAttack}/${finalHealth}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: snakeSummonResult.randomEvent,
        });
      }
    }

    owner.mana = 0;

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChimeraAbility {
    return new ChimeraAbility(newOwner, this.logService, this.abilityService);
  }
}
