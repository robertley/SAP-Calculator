import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Dazed } from 'app/domain/entities/catalog/equipment/ailments/dazed.class';


export class Tardigrade extends Pet {
  name = 'Tardigrade';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new TardigradeAbility(this, this.logService, this.abilityService),
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


class TardigradeToken extends Pet {
  name = 'Tardigrade';
  tier = 1;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  initAbilities(): void {
    // Tokens do not get abilities
  }

  constructor(
    logService: LogService,
    abilityService: AbilityService,
    parent: Player,
    health: number,
    attack: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(0, health, attack, 0, undefined, 0);
  }
}

export class TardigradeAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'Tardigrade Ability',
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

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const tokenStat = Math.max(1, this.level) * 3;
    const spawnIndex = owner.position ?? owner.savedPosition ?? 0;

    const token = new TardigradeToken(
      this.logService,
      this.abilityService,
      owner.parent,
      tokenStat,
      tokenStat,
    );

    const result = owner.parent.summonPet(token, spawnIndex, false, owner);
    if (result.success) {
      token.givePetEquipment(new Dazed());
      this.logService.createLog({
        message: `${owner.name} summoned a ${tokenStat}/${tokenStat} level ${this.level} Tardigrade (Dazed).`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
      });
    }

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): TardigradeAbility {
    return new TardigradeAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}




