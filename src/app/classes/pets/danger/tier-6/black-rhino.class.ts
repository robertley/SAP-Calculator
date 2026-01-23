import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BlackRhino extends Pet {
  name = 'Black Rhino';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 5;
  health = 9;

  initAbilities(): void {
    this.addAbility(new BlackRhinoAbility(this, this.logService));
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


export class BlackRhinoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BlackRhinoAbility',
      owner: owner,
      triggers: ['EnemyAttacked7'],
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

    let damage = 30; // Fixed 30 damage

    // Get all alive enemies and shuffle for random selection
    let targetsResp = owner.parent.opponent.getHighestHealthPets(
      owner.level,
      [],
      owner,
    );
    let targets = targetsResp.pets;
    for (let target of targets) {
      owner.snipePet(target, damage, targetsResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BlackRhinoAbility {
    return new BlackRhinoAbility(newOwner, this.logService);
  }
}
