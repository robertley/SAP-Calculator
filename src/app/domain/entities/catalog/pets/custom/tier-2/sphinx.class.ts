import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Sphinx extends Pet {
  name = 'Sphinx';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 2;
  health = 5;

  override initAbilities(): void {
    this.addAbility(new SphinxAbility(this));
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


export class SphinxAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Sphinx Ability',
      owner: owner,
      triggers: ['ThisBought'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const toyLevel = this.level;

    const adventurousToys = [
      'Tennis Ball',
      'Plastic Saw',
      'Toilet Paper',
      'Foam Sword',
      'Flashlight',
      'Television',
    ];

    // Choose one random adventurous toy
    const choice = chooseRandomOption(
      {
        key: 'pet.sphinx-toy-roll',
        label: formatPetScopedRandomLabel(owner, 'Sphinx adventurous toy roll'),
        options: adventurousToys.map((toy) => ({ id: toy, label: toy })),
      },
      () => getRandomInt(0, adventurousToys.length - 1),
    );
    const toyName = adventurousToys[choice.index];

    const newToy = gameApi?.toyService?.createToy(
      toyName,
      owner.parent,
      toyLevel,
    ) as Player['toy'];
    if (newToy) {
      owner.parent.toy = newToy;

      gameApi?.logService?.createLog({
        message: `${owner.name} gained a level ${toyLevel} ${toyName}.`,
        type: 'ability',
        player: owner.parent,
        randomEvent: choice.randomEvent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SphinxAbility {
    return new SphinxAbility(newOwner);
  }
}


