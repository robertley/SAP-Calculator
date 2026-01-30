import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Chick } from '../../hidden/chick.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Rooster extends Pet {
  name = 'Rooster';
  tier = 5;
  pack: Pack = 'Turtle';
  attack = 6;
  health = 4;
  initAbilities(): void {
    this.addAbility(
      new RoosterAbility(this, this.logService, this.abilityService),
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


export class RoosterAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'RoosterAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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

    let attack = Math.max(Math.floor(owner.attack * 0.5), 1);
    for (let i = 0; i < this.level; i++) {
      let chick = new Chick(
        this.logService,
        this.abilityService,
        owner.parent,
        1,
        attack,
        0,
        this.minExpForLevel,
      );

      let summonResult = owner.parent.summonPet(
        chick,
        owner.savedPosition,
        false,
        owner,
      );

      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} spawned Chick (${attack}).`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RoosterAbility {
    return new RoosterAbility(newOwner, this.logService, this.abilityService);
  }
}

