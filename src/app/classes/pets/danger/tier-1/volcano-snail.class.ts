import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Toasty } from 'app/classes/equipment/ailments/toasty.class';


export class VolcanoSnail extends Pet {
  name = 'Volcano Snail';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 1;
  health = 4;
  initAbilities(): void {
    this.addAbility(new VolcanoSnailAbility(this, this.logService));
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


export class VolcanoSnailAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'VolcanoSnailAbility',
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

    let petsWithPerk = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'perk',
      owner,
    );
    let petsWithToasty = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Toasty',
      owner,
    );
    let excludePets = [...petsWithPerk, ...petsWithToasty];
    let targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      excludePets,
      null,
      null,
      owner,
    );

    if (targetResp.pets.length === 0) {
      return;
    }

    for (let target of targetResp.pets) {
      let toasty = new Toasty();
      target.givePetEquipment(toasty);

      this.logService.createLog({
        message: `${owner.name} made ${target.name} Toasty`,
        type: 'ability',
        player: owner.parent,
        sourcePet: owner,
        targetPet: target,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VolcanoSnailAbility {
    return new VolcanoSnailAbility(newOwner, this.logService);
  }
}

