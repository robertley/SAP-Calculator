import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../equipment.class';
import { Pack, Pet } from '../../pet.class';
import { Player } from '../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Salmon extends Pet {
  name = 'Salmon';
  tier = 1;
  pack: Pack = 'Star';
  attack = 1;
  health = 1;
  hidden = true;

  initAbilities(): void {
    this.addAbility(new SalmonAbility(this, this.logService));
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


export class SalmonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SalmonAbility',
      owner: owner,
      triggers: ['ThisSummoned'],
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

    // Calculate number of attacks based on health (every 25 health)
    let attacks = 1 + Math.floor(owner.health / 25);

    let damage = this.level * 5;

    for (let i = 0; i < attacks; i++) {
      let targetResp = owner.parent.opponent.getRandomPet(
        [],
        false,
        true,
        false,
        owner,
      );
      if (targetResp.pet) {
        owner.snipePet(targetResp.pet, damage, targetResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SalmonAbility {
    return new SalmonAbility(newOwner, this.logService);
  }
}
