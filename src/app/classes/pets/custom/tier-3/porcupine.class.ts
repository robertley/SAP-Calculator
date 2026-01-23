import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Porcupine extends Pet {
  name = 'Porcupine';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 2;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new PorcupineAbility(this, this.logService));
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


export class PorcupineAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Porcupine Ability',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet } = context;
    const owner = this.owner;

    if (triggerPet && triggerPet.alive && triggerPet.parent !== owner.parent) {
      const damage = 3 * this.level;

      owner.dealDamage(triggerPet, damage);

      this.logService.createLog({
        message: `${owner.name} reflected ${damage} damage to ${triggerPet.name}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PorcupineAbility {
    return new PorcupineAbility(newOwner, this.logService);
  }
}
