import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class TigerBug extends Pet {
  name = 'Tiger Bug';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 4;
  initAbilities(): void {
    this.addAbility(new TigerBugAbility(this, this.logService));
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


export class TigerBugAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TigerBugAbility',
      owner: owner,
      triggers: ['ClearFront'],
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
    this.logService.createLog({
      message: `${owner.name} pushed ${pushTarget.name} to the front.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
    owner.parent.pushPetToFront(pushTarget, true);

    let snipeTargetsResp = owner.parent.opponent.getFurthestUpPets(
      2,
      [],
      owner,
    );
    let snipeTargets = snipeTargetsResp.pets;
    if (snipeTargets.length == 0) {
      return;
    }

    let power = this.level * 3;
    for (let target of snipeTargets) {
      if (target != null) {
        owner.snipePet(target, power, snipeTargetsResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TigerBugAbility {
    return new TigerBugAbility(newOwner, this.logService);
  }
}
