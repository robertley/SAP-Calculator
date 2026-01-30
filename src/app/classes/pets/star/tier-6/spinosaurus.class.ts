import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Power } from 'app/interfaces/power.interface';


export class Spinosaurus extends Pet {
  name = 'Spinosaurus';
  tier = 6;
  pack: Pack = 'Star';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new SpinosaurusAbility(this, this.logService));
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


export class SpinosaurusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SpinosaurusAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints'],
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

    let power: Power = {
      attack: this.level * 2,
      health: this.level * 3,
    };
    let targetResp = owner.parent.getRandomPet(
      [owner],
      true,
      false,
      true,
      owner,
    );
    if (targetResp.pet == null) {
      return;
    }
    targetResp.pet.increaseAttack(power.attack);
    targetResp.pet.increaseHealth(power.health);
    this.logService.createLog({
      message: `${owner.name} gave ${targetResp.pet.name} ${power.attack} attack and ${power.health} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SpinosaurusAbility {
    return new SpinosaurusAbility(newOwner, this.logService);
  }
}

