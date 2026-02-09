import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { AbilityQueueService } from 'app/integrations/ability/ability-queue.service';
import { InjectorService } from 'app/integrations/injector.service';


export class PinkRobin extends Pet {
  name = 'Pink Robin';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 3;
  health = 2;
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
    this.addAbility(new PinkRobinAbility(this));
    super.initAbilities();
  }
}


export class PinkRobinAbility extends Ability {
  constructor(owner: Pet) {
    super({
      name: 'Pink Robin Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const maxTier = this.level * 2;
    const friends = owner.parent.petArray.filter(
      (p) => p.alive && p !== owner && p.tier <= maxTier,
    );

    if (friends.length > 0) {
      const randomIndex = Math.floor(Math.random() * friends.length);
      const target = friends[randomIndex];
      const abilityQueueService = InjectorService.getInjector().get(
        AbilityQueueService,
      );
      const logService = InjectorService.getInjector().get(LogService);

      // Activate End Turn on the target
      abilityQueueService.triggerAbility(target, 'EndTurn', owner);

      logService.createLog({
        message: `${owner.name} activated End Turn on ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): PinkRobinAbility {
    return new PinkRobinAbility(newOwner);
  }
}



