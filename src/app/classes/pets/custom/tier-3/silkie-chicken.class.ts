import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { InjectorService } from 'app/services/injector.service';
import { getRandomInt } from 'app/util/helper-functions';


export class SilkieChicken extends Pet {
  name = 'Silkie Chicken';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new SilkieChickenAbility(this, this.logService));
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


export class SilkieChickenAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Silkie Chicken Ability',
      owner: owner,
      triggers: ['FriendGainsAilment'],
      abilityType: 'Pet',
      native: true,
      maxUses: 2,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon, triggerPet } = context;
    const owner = this.owner;
    const target = triggerPet;

    if (!target || !target.alive) {
      this.triggerTigerExecution(context);
      return;
    }

    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);
    const perks = equipmentService.getUsefulPerksByTier(1);

    if (perks.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const perkIndex = getRandomInt(0, perks.length - 1);
    const perk = perks[perkIndex];
    target.givePetEquipment(perk);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} the ${perk.name} perk.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SilkieChickenAbility {
    return new SilkieChickenAbility(newOwner, this.logService);
  }
}
