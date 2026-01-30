import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Rambutan } from 'app/classes/equipment/unicorn/rambutan.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class FurBearingTrout extends Pet {
  name = 'Fur-Bearing Trout';
  tier = 3;
  pack: Pack = 'Unicorn';
  attack = 3;
  health = 5;
  initAbilities(): void {
    this.addAbility(new FurBearingTroutAbility(this, this.logService));
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


export class FurBearingTroutAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FurBearingTroutAbility',
      owner: owner,
      triggers: ['Faint'],
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

    let targets = [];

    let tempPet: Pet = owner;
    while (targets.length < this.level) {
      let target: Pet = tempPet.petBehind();

      if (target == null) {
        break;
      }

      if (target.equipment instanceof Rambutan) {
        tempPet = target;
        continue;
      }

      targets.push(target);
      tempPet = target;
    }

    if (targets.length === 0) {
      return;
    }

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} a Rambutan.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });

      target.givePetEquipment(new Rambutan(this.logService));
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FurBearingTroutAbility {
    return new FurBearingTroutAbility(newOwner, this.logService);
  }
}

