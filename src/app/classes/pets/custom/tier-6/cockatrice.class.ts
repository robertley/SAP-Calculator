import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Rock } from 'app/classes/pets/hidden/rock.class';


export class Cockatrice extends Pet {
  name = 'Cockatrice';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 8;
  initAbilities(): void {
    this.addAbility(
      new CockatriceAbility(this, this.logService, this.abilityService),
    );
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


export class CockatriceAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CockatriceAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targets = owner.parent.opponent.petArray.reverse();
    let target = null;
    for (let pet of targets) {
      if (pet.level <= this.level) {
        target = pet;
        break;
      }
    }
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} transformed ${target.name} into a Rock.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    let rock = new Rock(
      this.logService,
      this.abilityService,
      target.parent,
      target.health,
      target.attack,
      target.mana,
      target.exp,
      target.equipment,
    );
    let position = target.position;
    owner.parent.opponent.setPet(position, rock, false);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CockatriceAbility {
    return new CockatriceAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
