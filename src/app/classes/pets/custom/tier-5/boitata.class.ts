import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Crisp } from 'app/classes/equipment/ailments/crisp.class';


export class Boitata extends Pet {
  name = 'Boitata';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 2;
  health = 9;
  initAbilities(): void {
    this.addAbility(
      new BoitataAbility(this, this.logService, this.abilityService),
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

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Crisp',
      owner,
    );
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
