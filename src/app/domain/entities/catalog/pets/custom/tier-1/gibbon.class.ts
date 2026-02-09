import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Player } from '../../../../player.class';
import { Pet, Pack } from '../../../../pet.class';
import { Equipment } from '../../../../equipment.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Gibbon extends Pet {
  name = 'Gibbon';
  tier = 1;
  pack: Pack = 'Custom';
  health = 2;
  attack = 1;
  initAbilities(): void {
    this.addAbility(
      new GibbonAbility(this, this.logService, this.abilityService),
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


export class GibbonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'GibbonAbility',
      owner: owner,
      triggers: ['ShopUpgrade'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level;
    let targetsBehindResp = owner.parent.nearestPetsBehind(2, owner);
    if (targetsBehindResp.pets.length === 0) {
      return;
    }

    for (let targetPet of targetsBehindResp.pets) {
      targetPet.increaseHealth(power);
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} ${power} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsBehindResp.random,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GibbonAbility {
    return new GibbonAbility(newOwner, this.logService, this.abilityService);
  }
}


