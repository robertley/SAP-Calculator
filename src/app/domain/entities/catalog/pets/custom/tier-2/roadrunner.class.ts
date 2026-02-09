import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Strawberry } from 'app/domain/entities/catalog/equipment/star/strawberry.class';


export class Roadrunner extends Pet {
  name = 'Roadrunner';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 4;
  health = 1;
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

  override initAbilities(): void {
    this.addAbility(new RoadrunnerAbility(this, this.logService));
    super.initAbilities();
  }
}


export class RoadrunnerAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Roadrunner Ability',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi } = context;
    const owner = this.owner;
    const amt = this.level;

    // Get pets ahead
    const friendsAhead = owner.parent.petArray
      .filter((p) => p.alive && p.position < owner.position)
      .sort((a, b) => b.position - a.position); // Nearest first

    const targets = friendsAhead.slice(0, amt);

    for (const target of targets) {
      // Give Strawberry perk
      const strawberry = new Strawberry(this.logService);
      if (strawberry) {
        target.applyEquipment(strawberry);
      }

      // Give +2 attack
      target.attack += 2;

      this.logService.createLog({
        message: `${owner.name} gave Strawberry and +2 attack to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): RoadrunnerAbility {
    return new RoadrunnerAbility(newOwner, this.logService);
  }
}



