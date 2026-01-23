import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Frog extends Pet {
  name = 'Frog';
  tier = 1;
  pack: Pack = 'Star';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new FrogAbility(this, this.logService));
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
