import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class SpottedHandfish extends Pet {
  name = 'Spotted Handfish';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new SpottedHandfishAbility(this));
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


export class SpottedHandfishAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Spotted Handfish Ability',
      owner: owner,
      triggers: ['StartTurn'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const amt = this.level;

    const ailments = [
      'Cold',
      'Crisp',
      'Dazed',
      'Icky',
      'Inked',
      'Spooked',
      'Weak',
      'Silly',
      'Bloated',
      'Confused',
      'Cursed',
      'Sad',
      'Sleepy',
      'Webbed',
    ];

    for (let i = 0; i < amt; i++) {
      const randomIndex = Math.floor(Math.random() * ailments.length);
      const ailmentName = ailments[randomIndex];

      // Add to canned ailments
      owner.parent.cannedAilments.push(ailmentName);

      (gameApi as any).logService.createLog({
        message: `${owner.name} stocked a canned ${ailmentName}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SpottedHandfishAbility {
    return new SpottedHandfishAbility(newOwner);
  }
}


