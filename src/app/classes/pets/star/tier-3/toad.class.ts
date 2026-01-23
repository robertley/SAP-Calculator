import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Weak } from 'app/classes/equipment/ailments/weak.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Toad extends Pet {
  name = 'Toad';
  tier = 3;
  pack: Pack = 'Star';
  attack = 3;
  health = 3;

  initAbilities(): void {
    this.addAbility(new ToadAbility(this, this.logService));
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


export class ToadAbility extends Ability {
  private logService: LogService;
  reset(): void {
    this.maxUses = this.owner.level * 2;
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ToadAbility',
      owner: owner,
      triggers: ['EnemyHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level * 2,
      condition: (context: AbilityContext) => {
        const { triggerPet } = context;
        return triggerPet && triggerPet.alive;
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

    let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
    let target = targetResp.pet;
    if (target?.equipment?.name === 'Weak') {
      let excludePets = owner.parent.getPetsWithEquipmentWithSillyFallback(
        'Weak',
        owner,
      );
      targetResp = owner.parent.opponent.getRandomPet(
        excludePets,
        null,
        true,
        null,
        owner,
      );
      target = targetResp.pet;
    }
    if (target == null) {
      return;
    }

    target.givePetEquipment(new Weak());
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Weak.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ToadAbility {
    return new ToadAbility(newOwner, this.logService);
  }
}
