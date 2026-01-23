import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Power } from 'app/interfaces/power.interface';


export class MonkeyFacedBat extends Pet {
  name = 'Monkey-Faced Bat';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new MonkeyFacedBatAbility(this, this.logService));
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


export class MonkeyFacedBatAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MonkeyFacedBatAbility',
      owner: owner,
      triggers: ['AnyoneBehindHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    // Get 2 random friends (excluding self)
    let targetsResp = owner.parent.getRandomPets(
      2,
      [owner],
      true,
      false,
      owner,
    );

    for (let target of targetsResp.pets) {
      if (target != null) {
        let power: Power = { attack: this.level, health: this.level * 2 };
        target.increaseAttack(power.attack);
        target.increaseHealth(power.health);

        this.logService.createLog({
          message: `${owner.name} gave ${target.name} ${power.attack} attack and ${power.health} health`,
          type: 'ability',
          player: owner.parent,
          randomEvent: targetsResp.random,
          tiger: tiger,
        });
      }
    }
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MonkeyFacedBatAbility {
    return new MonkeyFacedBatAbility(newOwner, this.logService);
  }
}
