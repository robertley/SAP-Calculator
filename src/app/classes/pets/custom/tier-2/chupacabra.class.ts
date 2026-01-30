import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Chupacabra extends Pet {
  name = 'Chupacabra';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 4;
  health = 2;
  initAbilities(): void {
    this.addAbility(new ChupacabraAbility(this, this.logService));
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


export class ChupacabraAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ChupacabraAbility',
      owner: owner,
      triggers: ['KnockOut'],
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

    for (let i = 0; i < this.level * 2; i++) {
      let targetResp = owner.parent.getRandomPet(
        [owner],
        true,
        false,
        true,
        owner,
      );
      if (targetResp.pet == null) {
        return;
      }

      targetResp.pet.increaseHealth(1);

      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} 1 health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChupacabraAbility {
    return new ChupacabraAbility(newOwner, this.logService);
  }
}
