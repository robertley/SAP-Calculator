import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Barghest extends Pet {
  name = 'Barghest';
  tier = 1;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new BarghestAbility(this, this.logService));
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


export class BarghestAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BarghestAbility',
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

    // Get pets that have equipment (non-ailments) to exclude them (we want perk-less pets)
    let petsWithPerks = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'perk',
      owner,
    );
    let petsWithSpooked = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Spooked',
      owner,
    );
    let excludePets = [...petsWithPerks, ...petsWithSpooked];
    let targetsResp = owner.parent.opponent.getLastPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetsResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let target of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} Spooked`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
      });

      target.givePetEquipment(new Spooked());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BarghestAbility {
    return new BarghestAbility(newOwner, this.logService);
  }
}



