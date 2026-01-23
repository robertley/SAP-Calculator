import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class MantisShrimp extends Pet {
  name = 'Mantis Shrimp';
  tier = 6;
  pack: Pack = 'Puppy';
  attack = 9;
  health = 3;
  initAbilities(): void {
    this.addAbility(new MantisShrimpAbility(this, this.logService));
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


export class MantisShrimpAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MantisShrimpAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    let opponent = owner.parent.opponent;
    for (let i = 0; i < this.level; i++) {
      let targetResp = opponent.getFurthestUpPet(owner);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }
      owner.snipePet(target, 10, targetResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MantisShrimpAbility {
    return new MantisShrimpAbility(newOwner, this.logService);
  }
}
