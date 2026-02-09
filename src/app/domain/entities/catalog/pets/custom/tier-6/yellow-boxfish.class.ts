import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class YellowBoxfish extends Pet {
  name = 'Yellow Boxfish';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(new YellowBoxfishAbility(this, this.logService));
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


export class YellowBoxfishAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'YellowBoxfishAbility',
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
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const allPets = owner.parent
      .getAll(true, owner)
      .pets.filter((pet) => pet && pet.alive && pet !== owner);
    if (allPets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const sorted = [...allPets].sort((a, b) => {
      const aVal = a.attack + a.health;
      const bVal = b.attack + b.health;
      return bVal - aVal;
    });

    const targets = sorted.slice(0, this.level);
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    for (const target of targets) {
      target.attack = 20;
      target.health = 20;
    }

    const names = targets.map((pet) => pet.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} set ${names} to 20/20 at faint.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): YellowBoxfishAbility {
    return new YellowBoxfishAbility(newOwner, this.logService);
  }
}



