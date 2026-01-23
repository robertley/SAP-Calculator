import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Dazed } from 'app/classes/equipment/ailments/dazed.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Mandrake extends Pet {
  name = 'Mandrake';
  tier = 3;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new MandrakeAbility(this, this.logService));
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


export class MandrakeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MandrakeAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Dazed',
      owner,
    );
    let targetResp = owner.parent.opponent.getTierXOrLowerPet(
      this.level * 2,
      excludePets,
      owner,
    );
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} made ${target.name} Dazed.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: true,
    });

    target.givePetEquipment(new Dazed());

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MandrakeAbility {
    return new MandrakeAbility(newOwner, this.logService);
  }
}
