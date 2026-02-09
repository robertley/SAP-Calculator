import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Walnut } from 'app/domain/entities/catalog/equipment/puppy/walnut.class';


export class Beetle extends Pet {
  name = 'Beetle';
  tier = 1;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new BeetleAbility(this, this.logService, this.abilityService),
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


export class BeetleAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BeetleAbility',
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
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let equipment;
    switch (this.level) {
      case 1:
        equipment = new Walnut();
        break;
      case 2:
        equipment = new Walnut();
        equipment.power = 4;
        equipment.originalPower = 4;
        break;
      case 3:
        equipment = new Walnut();
        equipment.power = 6;
        equipment.originalPower = 6;
        break;
    }
    let excludePets = owner.parent.getPetsWithEquipment(equipment.name);
    let targetsBehindResp = owner.parent.nearestPetsBehind(
      1,
      owner,
      excludePets,
    );
    if (targetsBehindResp.pets.length === 0) {
      return;
    }
    let targetPet = targetsBehindResp.pets[0];
    this.logService.createLog({
      message: `${owner.name} gave ${targetPet.name} ${equipment.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsBehindResp.random,
    });
    targetPet.givePetEquipment(equipment);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BeetleAbility {
    return new BeetleAbility(newOwner, this.logService, this.abilityService);
  }
}



