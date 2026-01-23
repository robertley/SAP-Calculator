import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Coconut } from 'app/classes/equipment/turtle/coconut.class';


export class Therizinosaurus extends Pet {
  name = 'Therizinosaurus';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 2;
  initAbilities(): void {
    this.addAbility(new TherizinosaurusAbility(this, this.logService));
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


export class TherizinosaurusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'TherizinosaurusAbility',
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

    let excludePets = owner.parent.getPetsWithoutEquipment('Strawberry');
    let targetsResp = owner.parent.getFurthestUpPets(
      this.level,
      excludePets,
      owner,
    );
    let targets = targetsResp.pets;
    for (let pet of targets) {
      pet.givePetEquipment(new Coconut());
      this.logService.createLog({
        message: `${owner.name} gave ${pet.name} Coconut.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: targetsResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TherizinosaurusAbility {
    return new TherizinosaurusAbility(newOwner, this.logService);
  }
}
