import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { WhiteOkra } from 'app/classes/equipment/danger/white-okra.class';


export class PaintedTerrapin extends Pet {
  name = 'Painted Terrapin';
  tier = 5;
  pack: Pack = 'Danger';
  health = 6;
  attack = 4;

  initAbilities(): void {
    this.addAbility(new PaintedTerrapinAbility(this, this.logService));
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


export class PaintedTerrapinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PaintedTerrapinAbility',
      owner: owner,
      triggers: ['BeforeThisDies'],
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

    let excludePets = owner.parent.getPetsWithEquipment('White Okra');
    let targetsResp = owner.parent.nearestPetsBehind(
      owner.level,
      owner,
      excludePets,
    );
    let targets = targetsResp.pets;

    for (let targetPet of targets) {
      this.logService.createLog({
        message: `${owner.name} gave ${targetPet.name} White Okra perk`,
        type: 'ability',
        tiger: tiger,
        player: owner.parent,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
      targetPet.givePetEquipment(new WhiteOkra());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PaintedTerrapinAbility {
    return new PaintedTerrapinAbility(newOwner, this.logService);
  }
}
