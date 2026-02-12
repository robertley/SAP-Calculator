import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { SmallerSlime } from 'app/domain/entities/catalog/pets/hidden/smaller-slime.class';


export class Slime extends Pet {
  name = 'Slime';
  tier = 3;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new SlimeAbility(this, this.logService));
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


export class SlimeAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Slime Ability',
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
    const battles = Math.max(0, owner.battlesFought ?? 0);
    const slimesToSpawn = Math.floor(battles / 2);

    if (slimesToSpawn <= 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const stats = 2 * this.level;
    let summoned = 0;

    for (let i = 0; i < slimesToSpawn; i++) {
      const ownerWithAbilityService = owner as Pet & {
        abilityService: AbilityService;
      };
      const slime = new SmallerSlime(
        this.logService,
        ownerWithAbilityService.abilityService,
        owner.parent,
        stats,
        stats,
      );
      const summonResult = owner.parent.summonPet(slime, owner.position);

      if (summonResult.success) {
        summoned++;
      } else {
        break;
      }
    }

    if (summoned > 0) {
      this.logService.createLog({
        message: `${owner.name} summoned ${summoned} ${stats}/${stats} Smaller Slime${summoned === 1 ? '' : 's'}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): SlimeAbility {
    return new SlimeAbility(newOwner, this.logService);
  }
}




