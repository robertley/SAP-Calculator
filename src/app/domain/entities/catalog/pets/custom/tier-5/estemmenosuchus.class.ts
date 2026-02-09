import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Estemmenosuchus extends Pet {
  name = 'Estemmenosuchus';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 4;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new EstemmenosuchusAbility(this, this.logService, this.abilityService),
    );
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


class EstemmenosuchusFriend extends Pet {
  name = "Estemmenosuchus's Ally";
  tier = 1;
  pack: Pack = 'Custom';
  attack = 1;
  health = 1;

  initAbilities(): void {
    // Tokens do not gain abilities
  }

  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
    attack: number,
    health: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(0, health, attack, 0, undefined, 0);
  }
}

export class EstemmenosuchusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Estemmenosuchus Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private countAilments(): number {
    const owner = this.owner;
    return owner.parent.petArray.filter((pet) => {
      const eqClass = pet?.equipment?.equipmentClass;
      return !!eqClass && eqClass.startsWith('ailment');
    }).length;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const ailmentCount = Math.max(0, this.countAilments());
    const buff = 3 + ailmentCount;
    const summonCount = Math.min(this.level, 3);
    const spawnIndex = owner.position ?? owner.savedPosition ?? 0;
    let summoned = 0;

    for (let i = 0; i < summonCount; i++) {
      const token = new EstemmenosuchusFriend(
        this.logService,
        this.abilityService,
        owner.parent,
        buff,
        buff,
      );
      const result = owner.parent.summonPet(token, spawnIndex, false, owner);
      if (result.success) {
        summoned++;
      } else {
        break;
      }
    }

    if (summoned > 0) {
      this.logService.createLog({
        message: `${owner.name} summoned ${summoned} 3/3 friend${summoned === 1 ? '' : 's'} with +${ailmentCount}/+${ailmentCount}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): EstemmenosuchusAbility {
    return new EstemmenosuchusAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}



