import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Crisp } from 'app/classes/equipment/ailments/crisp.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class RedDragon extends Pet {
  name = 'Red Dragon';
  tier = 5;
  pack: Pack = 'Unicorn';
  attack = 4;
  health = 8;
  initAbilities(): void {
    this.addAbility(new RedDragonAbility(this, this.logService));
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


export class RedDragonAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RedDragonAbility',
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

    let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
      'Crisp',
      owner,
    );
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
        message: `${owner.name} gave ${target.name} Crisp.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsResp.random,
      });
      target.givePetEquipment(new Crisp());
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RedDragonAbility {
    return new RedDragonAbility(newOwner, this.logService);
  }
}
