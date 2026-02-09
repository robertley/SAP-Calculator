import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { InjectorService } from 'app/integrations/injector.service';
import { getRandomInt } from 'app/runtime/random';
import { canApplyAilment, logAbility } from 'app/domain/entities/ability-resolution';
import { cloneEquipment } from 'app/runtime/equipment-clone';


export class LeafGecko extends Pet {
  name = 'Leaf Gecko';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 4;

  override initAbilities(): void {
    this.addAbility(new LeafGeckoAbility(this, this.logService));
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


export class LeafGeckoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Leaf Gecko Ability',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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
    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);
    const ailmentNames = Array.from(
      equipmentService.getInstanceOfAllAilments().keys(),
    );
    const targets = [
      ...owner.parent.petArray,
      ...owner.parent.opponent.petArray,
    ].filter((pet) => pet?.alive);

    if (ailmentNames.length === 0 || targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const requiredCount = this.level * 3;
    let appliedCount = 0;
    let attempts = 0;
    const maxAttempts = requiredCount * 5;

    while (appliedCount < requiredCount && attempts < maxAttempts) {
      const target = targets[getRandomInt(0, targets.length - 1)];
      const ailmentName =
        ailmentNames[getRandomInt(0, ailmentNames.length - 1)];
      if (!target || !canApplyAilment(target, ailmentName)) {
        attempts++;
        continue;
      }

      const ailmentInstance = equipmentService
        .getInstanceOfAllAilments()
        .get(ailmentName);
      if (!ailmentInstance) {
        attempts++;
        continue;
      }

      const ailmentClone = cloneEquipment(ailmentInstance);
      if (!ailmentClone) {
        attempts++;
        continue;
      }
      if (target.parent !== owner.parent) {
        ailmentClone.multiplier = 2;
        ailmentClone.multiplierMessage = ' x2 (Leaf Gecko)';
      }
      target.givePetEquipment(ailmentClone);
      appliedCount++;
      attempts++;
    }

    const message =
      appliedCount > 0
        ? `${owner.name} cursed ${appliedCount} pet${appliedCount === 1 ? '' : 's'} with random ailments.`
        : `${owner.name} could not apply any random ailments.`;

    logAbility(this.logService, owner, message, tiger, pteranodon);
    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): LeafGeckoAbility {
    return new LeafGeckoAbility(newOwner, this.logService);
  }
}









