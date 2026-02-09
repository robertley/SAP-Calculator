import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Chihuahua extends Pet {
  name = 'Chihuahua';
  tier = 1;
  pack: Pack = 'Star';
  attack = 4;
  health = 1;

  initAbilities(): void {
    this.addAbility(new ChihuahuaAbility(this, this.logService));
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


export class ChihuahuaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ChihuahuaAbility',
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

    const opponent = owner.parent.opponent;

    const targetInfo = opponent.getHighestHealthPet(undefined, owner);
    const target = targetInfo.pet;

    if (target) {
      const spaces = this.level;

      this.logService.createLog({
        message: `${owner.name} pushed ${target.name} forward ${spaces} space(s).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetInfo.random,
      });

      opponent.pushPet(target, spaces);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ChihuahuaAbility {
    return new ChihuahuaAbility(newOwner, this.logService);
  }
}


