import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Caladrius extends Pet {
  name = 'Caladrius';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new CaladriusAbility(this, this.logService));
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


export class CaladriusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Caladrius Ability',
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Check if triggerPet is a friend and has enough mana
    if (
      triggerPet &&
      triggerPet.parent === owner.parent &&
      triggerPet !== owner
    ) {
      if (triggerPet.mana >= 3) {
        const buff = 2 * this.level;
        triggerPet.mana -= 3;
        triggerPet.increaseAttack(buff);
        triggerPet.increaseHealth(buff);

        this.logService.createLog({
          message: `${owner.name} spent 3 mana from ${triggerPet.name} to give it +${buff}/+${buff}.`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
      }
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): CaladriusAbility {
    return new CaladriusAbility(newOwner, this.logService);
  }
}


