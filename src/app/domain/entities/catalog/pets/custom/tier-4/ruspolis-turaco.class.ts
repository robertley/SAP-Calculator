import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class RuspolisTuraco extends Pet {
  name = "Ruspoli's Turaco";
  tier = 4;
  pack: Pack = 'Custom';
  attack = 1;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new RuspolisTuracoAbility(this, this.logService));
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


export class RuspolisTuracoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: "Ruspoli's Turaco Ability",
      owner: owner,
      triggers: ['BeforeFriendAttacks'],
      abilityType: 'Pet',
      native: true,
      maxUses: 3,
      abilitylevel: owner.level,
      precondition: (context: AbilityContext) => {
        const target = context.triggerPet;
        return (
          !!target &&
          target.parent === this.owner.parent &&
          target.alive &&
          target.equipment?.name === 'Strawberry'
        );
      },
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon, triggerPet } = context;
    const owner = this.owner;
    const manaGain = 5 * this.level;

    if (!triggerPet || triggerPet.equipment?.name !== 'Strawberry') {
      this.triggerTigerExecution(context);
      return;
    }

    triggerPet.removePerk();
    triggerPet.increaseMana(manaGain);

    this.logService.createLog({
      message: `${owner.name} replaced ${triggerPet.name}'s Strawberry with +${manaGain} mana before attacking.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): RuspolisTuracoAbility {
    return new RuspolisTuracoAbility(newOwner, this.logService);
  }
}


