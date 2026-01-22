import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { AbilityService } from 'app/services/ability/ability.service';
import { Crisp } from '../../../../equipment/ailments/crisp.class';

export class BoitataAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  reset(): void {
    this.maxUses = this.level * 2;
    super.reset();
  }

  initUses(): void {
    this.maxUses = this.level * 2;
    super.initUses();
  }

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BoitataAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level * 2,
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

    let excludePets = owner.parent.opponent.getPetsWithEquipment('Crisp');
    let targetResp = owner.parent.opponent.getFurthestUpPet(owner, excludePets);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Crisp.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });
    target.givePetEquipment(new Crisp());

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BoitataAbility {
    return new BoitataAbility(newOwner, this.logService, this.abilityService);
  }
}
