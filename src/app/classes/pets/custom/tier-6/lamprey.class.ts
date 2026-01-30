import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Lamprey extends Pet {
  name = 'Lamprey';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 3;
  health = 8;
  initAbilities(): void {
    this.addAbility(new LampreyAbility(this, this.logService));
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


export class LampreyAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'LampreyAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints'],
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
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    if (!triggerPet) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetsResp = owner.parent.nearestPetsAhead(this.level, owner);
    if (targetsResp.pets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targets = targetsResp.pets;
    for (const target of targets) {
      owner.dealDamage(target, 1);
    }

    const targetNames = targets.map((p) => p.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} dealt 1 damage to ${targetNames} when ${triggerPet.name} fainted.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
      randomEvent: targetsResp.random,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): LampreyAbility {
    return new LampreyAbility(newOwner, this.logService);
  }
}

