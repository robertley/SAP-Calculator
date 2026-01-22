import { Ability, AbilityContext } from '../../../../ability.class';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class RockhopperPenguinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RockhopperPenguinAbility',
      owner: owner,
      triggers: ['ClearFront'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 1,
      condition: () => {
        return owner.parent.pet0 == null;
      },
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = owner.parent.getThis(owner);
    const target = targetResp.pet;
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    owner.parent.pushPetToFront(target, true);

    const trumpetsGained = this.level * 12;
    const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
    trumpetTargetResp.player.gainTrumpets(
      trumpetsGained,
      owner,
      pteranodon,
      undefined,
      undefined,
      trumpetTargetResp.random,
    );

    this.logService.createLog({
      message: `${owner.name} jumped to the front and gained +${trumpetsGained} trumpets.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
      randomEvent: targetResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RockhopperPenguinAbility {
    return new RockhopperPenguinAbility(newOwner, this.logService);
  }
}
