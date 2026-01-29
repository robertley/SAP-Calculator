import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { LoyalChinchilla } from 'app/classes/pets/hidden/loyal-chinchilla.class';


export class Chinchilla extends Pet {
  name = 'Chinchilla';
  tier = 1;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new ChinchillaAbility(this, this.logService, this.abilityService),
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


export class ChinchillaAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ChinchillaAbility',
      owner: owner,
      triggers: ['ThisSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const level = this.level;
    const exp = this.minExpForLevel;
    const power = 2 * level;

    const loyalChinchilla = new LoyalChinchilla(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
      null,
      exp,
    );

    const summonResult = owner.parent.summonPet(
      loyalChinchilla,
      owner.savedPosition,
      false,
      owner,
    );

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a ${power}/${power} Loyal Chinchilla (level ${level}).`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChinchillaAbility {
    return new ChinchillaAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
