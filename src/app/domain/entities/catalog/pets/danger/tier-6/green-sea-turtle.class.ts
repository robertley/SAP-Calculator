import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Melon } from 'app/domain/entities/catalog/equipment/turtle/melon.class';


export class GreenSeaTurtle extends Pet {
  name = 'Green Sea Turtle';
  tier = 6;
  pack: Pack = 'Danger';
  attack = 5;
  health = 6;

  initAbilities(): void {
    this.addAbility(new GreenSeaTurtleAbility(this, this.logService));
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


export class GreenSeaTurtleAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'GreenSeaTurtleAbility',
      owner: owner,
      triggers: ['EnemyAttacked5'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 1,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Give all friendly pets Melon
    let targetsResp = owner.parent.getAll(false, owner);
    let targets = targetsResp.pets;
    for (let targetPet of targets) {
      targetPet.givePetEquipment(new Melon(), owner.level);
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} Melon.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GreenSeaTurtleAbility {
    return new GreenSeaTurtleAbility(newOwner, this.logService);
  }
}



