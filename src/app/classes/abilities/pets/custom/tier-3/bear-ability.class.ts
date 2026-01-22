import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { Honey } from 'app/classes/equipment/turtle/honey.class';
import { AbilityService } from 'app/services/ability/ability.service';

export class BearAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BearAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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
    const range = this.level;
    const bearPosition = owner.savedPosition;
    const targets: Pet[] = [];

    // Check friend pets
    for (const pet of owner.parent.petArray) {
      if (pet.alive) {
        const distance = Math.abs(pet.position - bearPosition);
        if (distance > 0 && distance <= range) {
          targets.push(pet);
        }
      }
    }

    // Check opponent pets
    for (const pet of owner.parent.opponent.petArray) {
      if (pet.alive) {
        const distance = bearPosition + pet.position + 1;
        if (distance <= range) {
          targets.push(pet);
        }
      }
    }

    for (let target of targets) {
      target.givePetEquipment(new Honey(this.logService, this.abilityService));
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Honey.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BearAbility {
    return new BearAbility(newOwner, this.logService, this.abilityService);
  }
}
