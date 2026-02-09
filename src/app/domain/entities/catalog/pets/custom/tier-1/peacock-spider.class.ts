import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { canApplyAilment, getAdjacentAlivePets, logAbility } from 'app/domain/entities/ability-resolution';


export class PeacockSpider extends Pet {
  name = 'Peacock Spider';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new PeacockSpiderAbility(this, this.logService));
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


export class PeacockSpiderAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PeacockSpiderAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const targets = getAdjacentAlivePets(owner);

    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      if (!canApplyAilment(target, 'Spooked')) {
        continue;
      }
      const spooked = new Spooked();
      spooked.power = -this.level;
      spooked.originalPower = spooked.power;
      target.givePetEquipment(spooked);
      logAbility(
        this.logService,
        owner,
        `${owner.name} gave ${target.name} Spooked.`,
        tiger,
        pteranodon,
      );
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PeacockSpiderAbility {
    return new PeacockSpiderAbility(newOwner, this.logService);
  }
}






