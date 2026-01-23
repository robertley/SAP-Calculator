import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Moose extends Pet {
  name = 'Moose';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new MooseAbility(this, this.logService, this.abilityService),
    );
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


export class MooseAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Moose Ability',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const gameApi = context.gameApi;
    const tierOneCount = gameApi?.playerPetPool?.get(1)?.length ?? 0;
    if (tierOneCount === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const buffPerPet = 3 * this.level;
    const totalHealth = buffPerPet * tierOneCount;
    const targetResp = owner.parent.getRandomPets(
      1,
      [owner],
      false,
      false,
      owner,
    );
    const target = targetResp.pets[0];
    if (!target) {
      this.triggerTigerExecution(context);
      return;
    }

    target.increaseHealth(totalHealth);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${totalHealth} health from ${tierOneCount} Tier 1 shop pets.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: targetResp.random,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MooseAbility {
    return new MooseAbility(newOwner, this.logService, this.abilityService);
  }
}
