import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Dolphin extends Pet {
  name = 'Dolphin';
  tier = 3;
  pack: Pack = 'Turtle';
  health = 3;
  attack = 4;
  hasRandomEvents = true;
  initAbilities(): void {
    this.addAbility(new DolphinAbility(this, this.logService));
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


export class DolphinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'DolphinAbility',
      owner: owner,
      triggers: ['StartBattle'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let opponent = owner.parent.opponent;

    for (let i = 0; i < this.level; i++) {
      let lowestHealthResp = opponent.getLowestHealthPet(null, owner);
      if (!lowestHealthResp.pet) {
        break;
      }
      owner.snipePet(lowestHealthResp.pet, 4, lowestHealthResp.random, tiger);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): DolphinAbility {
    return new DolphinAbility(newOwner, this.logService);
  }
}


