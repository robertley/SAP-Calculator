import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class WhaleShark extends Pet {
  name = 'Whale Shark';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 6;
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
  initAbilities(): void {
    this.addAbility(
      new WhaleSharkAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
}


export class WhaleSharkAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'WhaleSharkAbility',
      owner: owner,
      triggers: ['ThisGainedPerk', 'ThisGainedAilment'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    if (owner.equipment) {
      // Remove the equipment that was just gained
      this.logService.createLog({
        message: `${owner.name} removed ${owner.equipment.name}`,
        type: 'ability',
        player: owner.parent,
      });
      owner.removePerk();
    }

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    let power = this.level * 3;
    target.increaseAttack(power);
    target.increaseHealth(power);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} attack and ${power} health.`,
      type: 'ability',
      player: owner.parent,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WhaleSharkAbility {
    return new WhaleSharkAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


