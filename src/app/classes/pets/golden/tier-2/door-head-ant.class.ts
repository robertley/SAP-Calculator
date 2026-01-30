import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class DoorHeadAnt extends Pet {
  name = 'Door Head Ant';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new DoorHeadAntAbility(this, this.logService));
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


export class DoorHeadAntAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DoorHeadAntAbility',
      owner: owner,
      triggers: ['EmptyFrontSpace'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const owner = this.owner;
        // Check if first pet is null (front space is empty)
        return owner.parent.pet0 == null;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let pushTargetResp = owner.parent.getThis(owner);
    let pushTarget = pushTargetResp.pet;
    if (pushTarget == null) {
      return;
    }
    // Push self to front
    owner.parent.pushPetToFront(pushTarget, true);
    this.logService.createLog({
      message: `${owner.name} pushed ${pushTarget.name} to the front.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: pushTargetResp.random,
    });

    // Gain health based on level
    let power = this.level * 4;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gained ${power} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DoorHeadAntAbility {
    return new DoorHeadAntAbility(newOwner, this.logService);
  }
}
