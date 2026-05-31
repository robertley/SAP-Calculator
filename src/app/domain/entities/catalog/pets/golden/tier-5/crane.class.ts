import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Melon } from 'app/domain/entities/catalog/equipment/turtle/melon.class';


export class Crane extends Pet {
  name = 'Crane';
  tier = 5;
  pack: Pack = 'Golden';
  attack = 6;
  health = 5;
  initAbilities(): void {
    this.addAbility(new CraneAbility(this, this.logService));
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


export class CraneAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CraneAbility',
      owner: owner,
      triggers: ['FriendAheadHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const targetResp = triggerPet
      ? { pets: [triggerPet], random: false }
      : owner.parent.nearestPetsAhead(1, owner);
    const target = targetResp.pets[0];
    if (!target) {
      return;
    }
    if (target.alive) {
      target.givePetEquipment(new Melon());
    } else {
      target.applyEquipment(new Melon());
    }
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} Melon.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    target.increaseAttack(5);
    this.logService.createLog({
      message: `${owner.name} gave ${target.name} 5 attack.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  reset(): void {
    super.reset();
    this.maxUses = this.level;
  }

  copy(newOwner: Pet): CraneAbility {
    return new CraneAbility(newOwner, this.logService);
  }
}



