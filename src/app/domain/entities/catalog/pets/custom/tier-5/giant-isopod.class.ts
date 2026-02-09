import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GiantIsopod extends Pet {
  name = 'Giant Isopod';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 6;
  initAbilities(): void {
    this.addAbility(new GiantIsopodAbility(this, this.logService));
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


export class GiantIsopodAbility extends Ability {
  private logService: LogService;
  private triggerCount = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Giant Isopod Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const baseHealth = [2, 4, 6][Math.min(Math.max(this.level - 1, 0), 2)];
    const extra = Math.floor(this.triggerCount / 2);
    const healthGain = baseHealth + extra;

    const friends = owner.parent.petArray.filter(
      (friend) => friend && friend.alive && friend !== owner,
    );
    for (const friend of friends) {
      friend.increaseHealth(healthGain);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${friends.length} friends +${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });

    if (owner.parent.trumpets >= 2) {
      owner.parent.spendTrumpets(2, owner);
    }

    this.triggerCount++;
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GiantIsopodAbility {
    return new GiantIsopodAbility(newOwner, this.logService);
  }
}



