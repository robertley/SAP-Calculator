import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Tasty } from 'app/domain/entities/catalog/equipment/ailments/tasty.class';


export class SeaCucumber extends Pet {
  name = 'Sea Cucumber';
  tier = 5;
  pack: Pack = 'Custom';
  health = 5;
  attack = 3;

  initAbilities(): void {
    this.addAbility(
      new SeaCucumberAbility(this, this.logService, this.abilityService),
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


export class SeaCucumberAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'SeaCucumberAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Tasty',
      owner,
    );
    let targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      excludePets,
      false,
      true,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      let tasty = new Tasty(this.logService);
      target.givePetEquipment(tasty);
      this.logService.createLog({
        message: `${owner.name} made ${target.name} Tasty`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SeaCucumberAbility {
    return new SeaCucumberAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



