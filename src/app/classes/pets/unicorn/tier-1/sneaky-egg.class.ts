import { Power } from 'app/interfaces/power.interface';
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { CrackedEgg } from '../../hidden/cracked-egg.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class SneakyEgg extends Pet {
  name = 'Sneaky Egg';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 1;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new SneakyEggAbility(this, this.logService, this.abilityService),
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


export class SneakyEggAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SneakyEggAbility',
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

    let power: Power = {
      attack: this.level * 4,
      health: this.level * 2,
    };

    owner.health = 0;
    owner.parent.handleDeath(owner);
    owner.parent.removeDeadPets();

    let egg = new CrackedEgg(
      this.logService,
      this.abilityService,
      owner.parent,
      power.health,
      power.attack,
      0,
    );

    let summonResult = owner.parent.summonPet(
      egg,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned a ${power.attack}/${power.health} Cracked Egg`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SneakyEggAbility {
    return new SneakyEggAbility(newOwner, this.logService, this.abilityService);
  }
}
