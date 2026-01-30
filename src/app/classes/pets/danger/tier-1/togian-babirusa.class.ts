import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class TogianBabirusa extends Pet {
  name = 'Togian Babirusa';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new TogianBabirusaAbility(this, this.logService));
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


// Faint: Give one random enemy +1 health.
export class TogianBabirusaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TogianBabirusaAbility',
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

    let targetResp = owner.parent.opponent.getRandomPet(
      [],
      false,
      false,
      false,
      owner,
    );

    if (targetResp.pet) {
      // getRandomPet returns null if no living pets
      targetResp.pet.increaseHealth(1);
      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} +1 health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TogianBabirusaAbility {
    return new TogianBabirusaAbility(newOwner, this.logService);
  }
}

