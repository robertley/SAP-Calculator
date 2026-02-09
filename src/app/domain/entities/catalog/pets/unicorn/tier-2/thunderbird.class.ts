import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Thunderbird extends Pet {
  name = 'Thunderbird';
  tier = 2;
  pack: Pack = 'Unicorn';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(new ThunderbirdAbility(this, this.logService));
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


export class ThunderbirdAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'ThunderbirdAbility',
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

    let targetsResp = owner.parent.nearestPetsAhead(2, owner);
    let targets = targetsResp.pets;
    if (targets.length < 1) {
      return;
    }
    let target = targetsResp.pets[1] ?? targetsResp.pets[0];
    if (target == null) {
      return;
    }

    let power = this.level * 3;
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} ${power} mana.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsResp.random,
    });
    target.increaseMana(power);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ThunderbirdAbility {
    return new ThunderbirdAbility(newOwner, this.logService);
  }
}


