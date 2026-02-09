import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { shuffle } from 'app/runtime/random';


export class SugarGlider extends Pet {
  name = 'Sugar Glider';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 1;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new SugarGliderAbility(this, this.logService));
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


export class SugarGliderAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Sugar Glider Ability',
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
    const manaBuff = 2 * this.level;

    const friends = shuffle(
      owner.parent.petArray.filter((p) => p.alive && p !== owner),
    );
    const targets = friends.slice(0, 2);

    for (const target of targets) {
      target.mana += manaBuff;
    }

    if (targets.length > 0) {
      this.logService.createLog({
        message: `${owner.name} gave ${manaBuff} mana to ${targets.length} friends.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SugarGliderAbility {
    return new SugarGliderAbility(newOwner, this.logService);
  }
}






