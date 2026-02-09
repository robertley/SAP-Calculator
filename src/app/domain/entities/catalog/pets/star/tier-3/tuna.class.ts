import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Tuna extends Pet {
  name = 'Tuna';
  tier = 3;
  pack: Pack = 'Star';
  attack = 3;
  health = 5;

  initAbilities(): void {
    this.addAbility(new TunaAbility(this, this.logService));
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
    timesHurt?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.timesHurt = timesHurt ?? 0;
    this.originalTimesHurt = this.timesHurt;
  }
}


export class TunaAbility extends Ability {
  private logService: LogService;
  private timesHurtOverride: number | null;

  constructor(owner: Pet, logService: LogService, timesHurtOverride?: number) {
    super({
      name: 'TunaAbility',
      owner: owner,
      triggers: ['Faint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.timesHurtOverride = timesHurtOverride ?? null;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let totalHurt = this.timesHurtOverride ?? owner.timesHurt;
    for (let i = 0; i < totalHurt; i++) {
      const targetResp = owner.parent.getRandomPet(
        [owner],
        true,
        false,
        true,
        owner,
      );

      if (targetResp.pet == null) {
        continue;
      }

      const buffAmount = this.level;

      this.logService.createLog({
        message: `${owner.name} gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });

      targetResp.pet.increaseAttack(buffAmount);
      targetResp.pet.increaseHealth(buffAmount);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): TunaAbility {
    return new TunaAbility(
      newOwner,
      this.logService,
      this.timesHurtOverride ?? this.owner.timesHurt,
    );
  }
}



