import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class WinterSpirit extends Pet {
  name = 'Winter Spirit';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 8;
  initAbilities(): void {
    this.addAbility(new WinterSpiritAbility(this, this.logService));
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


export class WinterSpiritAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WinterSpiritAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => this.executeAbility(context),
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { tiger, pteranodon } = context;
    const owner = this.owner;
    const targetsResp = owner.parent.nearestPetsAhead(2, owner);
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const manaGain = this.level * 5;
    const names = [];
    for (const target of targets) {
      target.increaseMana(manaGain);
      names.push(target.name);
    }

    this.logService.createLog({
      message: `${owner.name} gave ${names.join(', ')} +${manaGain} mana at end of turn.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WinterSpiritAbility {
    return new WinterSpiritAbility(newOwner, this.logService);
  }
}


