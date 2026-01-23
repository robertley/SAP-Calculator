import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Weak } from 'app/classes/equipment/ailments/weak.class';


export class Bat extends Pet {
  name = 'Bat';
  tier = 2;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 4;
  initAbilities(): void {
    this.addAbility(new BatAbility(this, this.logService));
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


export class BatAbility extends Ability {
  private logService: LogService;

  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'BatAbility',
      owner: owner,
      triggers: ['BeforeThisAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
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
      'Weak',
      owner,
    );
    let targetsResp = owner.parent.opponent.getRandomPet(
      excludePets,
      null,
      true,
      null,
      owner,
    );
    let target = targetsResp.pet;
    if (target != null) {
      target.givePetEquipment(new Weak());
      this.logService.createLog({
        message: `${owner.name} made ${target.name} weak.`,
        type: 'ability',
        player: owner.parent,
        randomEvent: targetsResp.random,
        tiger: tiger,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BatAbility {
    return new BatAbility(newOwner, this.logService);
  }
}
