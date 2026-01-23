import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { InjectorService } from 'app/services/injector.service';


export class Toucan extends Pet {
  name = 'Toucan';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new ToucanAbility(this, this.logService));
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


export class ToucanAbility extends Ability {
  private logService: LogService;
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ToucanAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return this.owner.timesAttacked < 1;
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

    // Determine which equipment to copy
    let equipmentName: string;
    if (owner.equipment == null || owner.equipment.tier > 5) {
      equipmentName = 'Egg';
    } else {
      equipmentName = owner.equipment.name;
    }

    let excludePets = owner.parent.getPetsWithEquipment(equipmentName);
    let targetsResp = owner.parent.nearestPetsBehind(
      this.level,
      owner,
      excludePets,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }
    for (let target of targets) {
      const newEquipmentInstance = InjectorService.getInjector()
        .get(EquipmentService)
        .getInstanceOfAllEquipment()
        .get(equipmentName);
      if (!newEquipmentInstance) {
        continue;
      }
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} ${newEquipmentInstance.name}`,
        type: 'ability',
        player: owner.parent,
        randomEvent: false,
        tiger: tiger,
        pteranodon: pteranodon,
      });

      target.givePetEquipment(newEquipmentInstance);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ToucanAbility {
    return new ToucanAbility(newOwner, this.logService);
  }
}
