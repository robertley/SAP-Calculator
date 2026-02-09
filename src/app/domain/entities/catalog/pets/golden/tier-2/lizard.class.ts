import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { LizardTail } from 'app/domain/entities/catalog/pets/hidden/lizard-tail.class';


export class Lizard extends Pet {
  name = 'Lizard';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 1;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new LizardAbility(this, this.logService, this.abilityService),
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


export class LizardAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'LizardAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: 2,
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

    let lizardTail = new LizardTail(
      this.logService,
      this.abilityService,
      owner.parent,
      null,
      null,
      0,
      owner.minExpForLevel,
    );

    let summonResult = owner.parent.summonPetInFront(owner, lizardTail);

    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned Lizard Tail Level ${owner.level}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LizardAbility {
    return new LizardAbility(newOwner, this.logService, this.abilityService);
  }
}



