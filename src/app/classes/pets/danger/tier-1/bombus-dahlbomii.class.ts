import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class BombusDahlbomii extends Pet {
  name = 'Bombus Dahlbomii';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 1;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new BombusDahlbomiiAbility(this, this.logService, this.abilityService),
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


export class BombusDahlbomiiAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BombusDahlbomiiAbility',
      owner: owner,
      triggers: ['EnemyAttacked2'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
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

    // Set counter event to deal damage
    this.abilityService.setCounterEvent({
      callback: () => {
        let targetResp = owner.parent.opponent.getFurthestUpPet(owner); // First enemy
        let target = targetResp.pet;
        if (target) {
          let damage = this.level * 1;
          owner.snipePet(target, damage, targetResp.random, tiger);
        }
      },
      priority: owner.attack,
      pet: owner,
    });
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BombusDahlbomiiAbility {
    return new BombusDahlbomiiAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
