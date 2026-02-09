import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class RuspolisTuraco extends Pet {
  name = 'Ruspolis Turaco';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
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
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const manaGain = [4, 8, 12][Math.min(this.level - 1, 2)];

    const transformed: string[] = [];
    owner.parent.petArray.forEach((friend) => {
      if (!friend || !friend.alive || !friend.equipment) {
        return;
      }

      if (friend.equipment.name === 'Strawberry') {
        friend.removePerk();
        friend.increaseMana(manaGain);
        transformed.push(friend.name);
      }
    });

    if (transformed.length > 0) {
      this.logService.createLog({
        message: `${owner.name} replaced Strawberries on ${transformed.join(', ')} with +${manaGain} mana.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): RuspolisTuracoAbility {
    return new RuspolisTuracoAbility(newOwner, this.logService);
  }
}


