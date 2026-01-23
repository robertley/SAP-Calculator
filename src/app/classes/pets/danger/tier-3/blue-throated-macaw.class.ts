import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BlueThroatedMacaw extends Pet {
  name = 'Blue-Throated Macaw';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 3;
  health = 4;
  initAbilities(): void {
    this.addAbility(new BlueThroatedMacawAbility(this, this.logService));
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


export class BlueThroatedMacawAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BlueThroatedMacawAbility',
      owner: owner,
      triggers: ['FriendTransformed'],
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

    if (!triggerPet) {
      return;
    }

    //ahead
    if (triggerPet.position < owner.position) {
      let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
      let target = targetResp.pet;

      if (!target) {
        return;
      }
      let power = this.level * 3;

      target.increaseAttack(power);

      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${power} attack.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    } else {
      let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
      let target = targetResp.pet;

      if (!target) {
        return;
      }
      let power = this.level * 3;

      target.increaseHealth(power);

      this.logService.createLog({
        message: `${owner.name} gave ${target.name} +${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BlueThroatedMacawAbility {
    return new BlueThroatedMacawAbility(newOwner, this.logService);
  }
}
