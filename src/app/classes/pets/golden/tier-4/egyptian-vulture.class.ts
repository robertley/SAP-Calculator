import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class EgyptianVulture extends Pet {
  name = 'Egyptian Vulture';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 7;
  health = 4;
  initAbilities(): void {
    this.addAbility(new EgyptianVultureAbility(this, this.logService));
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


export class EgyptianVultureAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'EgyptianVultureAbility',
      owner: owner,
      triggers: ['ThisKilledEnemy'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    let excludePets = owner.parent.petArray.filter((pet) => {
      return !pet.isFaintPet();
    });
    let targetsBehindResp = owner.parent.nearestPetsBehind(
      1,
      owner,
      excludePets,
    );
    let friendBehind = targetsBehindResp.pets[0];

    this.logService.createLog({
      message: `${owner.name} activated ${friendBehind.name}'s ability.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetsBehindResp.random,
    });

    friendBehind.activateAbilities(undefined, gameApi, 'Pet');

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    super.reset();
    this.maxUses = this.level;
  }

  copy(newOwner: Pet): EgyptianVultureAbility {
    return new EgyptianVultureAbility(newOwner, this.logService);
  }
}
