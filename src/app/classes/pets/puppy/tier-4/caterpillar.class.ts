import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Butterfly } from 'app/classes/pets/hidden/butterfly.class';


export class Caterpillar extends Pet {
  name = 'Caterpillar';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 1;
  health = 1;
  initAbilities(): void {
    this.addAbility(
      new CaterpillarAbility(this, this.logService, this.abilityService),
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


export class CaterpillarAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'CaterpillarAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.level >= 3;
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

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    let butterfly = new Butterfly(
      this.logService,
      this.abilityService,
      target.parent,
      target.health,
      target.attack,
      target.mana,
      target.exp,
      target.equipment,
    );
    owner.parent.transformPet(target, butterfly);
    this.logService.createLog({
      message: `${owner.name} transformed into a Butterfly.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CaterpillarAbility {
    return new CaterpillarAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}
