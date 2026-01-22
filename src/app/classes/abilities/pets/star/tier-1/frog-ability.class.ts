import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';

export class FrogAbility extends Ability {
  private logService: LogService;
  // Frog Ability not SOB at lvl 1 now, changed to Sell, deleted trigger, kept original implementation
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FrogAbility',
      owner: owner,
      triggers: [],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.level === 1;
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

    // Get pets ahead and behind with Silly-aware targeting
    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
    let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);

    if (
      targetsAheadResp.pets.length === 0 ||
      targetsBehindResp.pets.length === 0
    ) {
      return;
    }

    let petInFront = targetsAheadResp.pets[0];
    let petInBack = targetsBehindResp.pets[0];

    let petInFrontAttack = petInFront.attack;
    let petInFrontHealth = petInFront.health;
    let petInBackAttack = petInBack.attack;
    let petInBackHealth = petInBack.health;

    petInFront.attack = petInBackAttack;
    petInFront.health = petInBackHealth;
    petInBack.attack = petInFrontAttack;
    petInBack.health = petInFrontHealth;

    let isRandom = targetsAheadResp.random || targetsBehindResp.random;
    this.logService.createLog({
      message: `${owner.name} swapped the attack and health of ${petInFront.name} and ${petInBack.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: isRandom,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FrogAbility {
    return new FrogAbility(newOwner, this.logService);
  }
}
