import { Strawberry } from 'app/classes/equipment/star/strawberry.class';
import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Hummingbird extends Pet {
  name = 'Hummingbird';
  tier = 1;
  pack: Pack = 'Star';
  attack = 2;
  health = 2;

  initAbilities(): void {
    this.addAbility(
      new HummingbirdAbility(this, this.logService, this.abilityService),
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


export class HummingbirdAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'HummingbirdAbility',
      owner: owner,
      triggers: ['ThisDied'],
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

    let excludePets = owner.parent.getPetsWithEquipment('Strawberry');
    let targetsResp = owner.parent.nearestPetsBehind(
      this.level,
      owner,
      excludePets,
    );
    if (targetsResp.pets.length === 0) {
      return;
    }

    for (let target of targetsResp.pets) {
      target.givePetEquipment(new Strawberry(this.logService));
      this.logService.createLog({
        message: `${owner.name} gave ${target.name} strawberry.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HummingbirdAbility {
    return new HummingbirdAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
