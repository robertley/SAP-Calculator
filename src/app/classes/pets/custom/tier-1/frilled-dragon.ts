import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class FrilledDragon extends Pet {
  name = 'Frilled Dragon';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(new FrilledDragonAbility(this, this.logService));
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


export class FrilledDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FrilledDragonAbility',
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

    let power = 0;
    for (let pet of owner.parent.petArray) {
      if (pet !== owner && pet.isFaintPet()) {
        power++;
      }
    }
    power *= this.level;
    owner.increaseAttack(power);
    owner.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gained ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FrilledDragonAbility {
    return new FrilledDragonAbility(newOwner, this.logService);
  }
}
