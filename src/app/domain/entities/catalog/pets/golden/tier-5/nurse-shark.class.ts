import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class NurseShark extends Pet {
  name = 'Nurse Shark';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 5;
  health = 7;
  initAbilities(): void {
    this.addAbility(new NurseSharkAbility(this, this.logService));
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


export class NurseSharkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'NurseSharkAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (owner.parent.trumpets == 0) {
          return false;
        }
        return true;
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
    let power = Math.min(owner.parent.trumpets, 6) * 3;
    let targetResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      this.level,
      [],
      false,
      true,
      owner,
    );
    let targets = targetResp.pets;
    if (targets.length == 0) {
      return;
    }

    owner.parent.spendTrumpets(
      Math.min(owner.parent.trumpets, 6),
      owner,
      pteranodon,
    );
    for (let target of targets) {
      owner.snipePet(target, power, targetResp.random, tiger, pteranodon);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): NurseSharkAbility {
    return new NurseSharkAbility(newOwner, this.logService);
  }
}



