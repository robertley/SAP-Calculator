import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class PiedTamarin extends Pet {
  name = 'Pied Tamarin';
  tier = 1;
  pack: Pack = 'Golden';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(new PiedTamarinAbility(this, this.logService));
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


export class PiedTamarinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PiedTamarinAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.parent.trumpets >= 1;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      null,
      null,
      true,
      owner,
    );
    for (let target of targetsResp.pets) {
      if (target != null) {
        owner.snipePet(target, 3, targetsResp.random, tiger, pteranodon);
      }
    }
    if (targetsResp.pets.length > 0) {
      owner.parent.spendTrumpets(1, owner, pteranodon);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PiedTamarinAbility {
    return new PiedTamarinAbility(newOwner, this.logService);
  }
}



