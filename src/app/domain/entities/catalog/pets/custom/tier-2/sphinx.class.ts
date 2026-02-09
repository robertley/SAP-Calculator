import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


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
    const randomIndex = Math.floor(Math.random() * adventurousToys.length);
    const toyName = adventurousToys[randomIndex];

    const newToy = (gameApi as any).toyService.createToy(
      toyName,
      owner.parent,
      toyLevel,
    );
    if (newToy) {
      owner.parent.toy = newToy;

      (gameApi as any).logService.createLog({
        message: `${owner.name} gained a level ${toyLevel} ${toyName}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SphinxAbility {
    return new SphinxAbility(newOwner);
  }
}


