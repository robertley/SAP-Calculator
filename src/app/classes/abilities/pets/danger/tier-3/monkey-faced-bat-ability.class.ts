import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Power } from 'app/interfaces/power.interface';

export class MonkeyFacedBatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MonkeyFacedBatAbility',
      owner: owner,
      triggers: ['AnyoneBehindHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Get 2 random friends (excluding self)
    let targetsResp = owner.parent.getRandomPets(
      2,
      [owner],
      true,
      false,
      owner,
    );

    for (let target of targetsResp.pets) {
      if (target != null) {
        let power: Power = { attack: this.level, health: this.level * 2 };
        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);

        this.logService.createLog({
          message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health`,
          type: 'ability',
          player: owner.parent,
          randomEvent: targetsResp.random,
          tiger: tiger,
        });
      }
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MonkeyFacedBatAbility {
    return new MonkeyFacedBatAbility(newOwner, this.logService);
  }
}
