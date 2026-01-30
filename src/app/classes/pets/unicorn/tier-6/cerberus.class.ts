import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { FirePup } from 'app/classes/pets/hidden/fire-pup.class';


export class Cerberus extends Pet {
  name = 'Cerberus';
  tier = 6;
  pack: Pack = 'Unicorn';
  attack = 9;
  health = 9;
  initAbilities(): void {
    this.addAbility(
      new CerberusAbility(this, this.logService, this.abilityService),
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


export class CerberusAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CerberusAbility',
      owner: owner,
      triggers: ['EmptyFrontSpace'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      condition: (context: AbilityContext) => {
        const owner = this.owner;
        // Check if first pet is null (front space is empty)
        return owner.parent.pet0 == null;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let exp = 5;
    let firePup = new FirePup(
      this.logService,
      this.abilityService,
      owner.parent,
      8,
      8,
      null,
      exp,
    );

    let summonResult = owner.parent.summonPet(firePup, 0, false, owner);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Fire Pup (8/8).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        sourcePet: owner,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }
  reset(): void {
    this.maxUses = this.level;
    super.reset();
  }
  copy(newOwner: Pet): CerberusAbility {
    return new CerberusAbility(newOwner, this.logService, this.abilityService);
  }
}
