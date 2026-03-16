import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Weak } from 'app/domain/entities/catalog/equipment/ailments/weak.class';


export class Flea extends Pet {
  name = 'Flea';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new FleaAbility(this, this.logService));
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


export class FleaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'FleaAbility',
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
    const owner = this.owner;

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Weak',
      owner,
    );
    let targetsResp = owner.parent.opponent.getHighestHealthPets(
      1,
      excludePets,
      owner,
    );

    for (let target of targetsResp.pets) {
      const equipment = new Weak();
      equipment.power *= this.level;
      equipment.originalPower = equipment.power;
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Weak.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: targetsResp.random,
      });
      target.givePetEquipment(equipment);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): FleaAbility {
    return new FleaAbility(newOwner, this.logService);
  }
}




