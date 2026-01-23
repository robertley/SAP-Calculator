import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class SalmonOfKnowledge extends Pet {
  name = 'Salmon of Knowledge';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(new SalmonOfKnowledgeAbility(this, this.logService));
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


export class SalmonOfKnowledgeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SalmonOfKnowledgeAbility',
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

    let power = this.level * 2;
    let targets = [];

    // Get 2 furthest up pets from friendly team
    let friendlyTargets = owner.parent.getFurthestUpPets(2, [owner], owner);
    targets.push(...friendlyTargets.pets);

    // Get 2 furthest up pets from enemy team
    let enemyTargets = owner.parent.opponent.getFurthestUpPets(
      2,
      undefined,
      owner,
    );
    targets.push(...enemyTargets.pets);

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${power} exp.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: friendlyTargets.random || enemyTargets.random,
      });
      target.increaseExp(power);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SalmonOfKnowledgeAbility {
    return new SalmonOfKnowledgeAbility(newOwner, this.logService);
  }
}
