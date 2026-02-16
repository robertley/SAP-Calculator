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
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


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
      triggers: ['Faint'],
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
    const appliedDetails: string[] = [];
    let attempts = 0;
    const maxAttempts = requiredCount * 5;
    let randomEvent = false;

    while (appliedCount < requiredCount && attempts < maxAttempts) {
      const targetDecision = chooseRandomOption(
        {
          key: 'pet.leaf-gecko-target',
          label: formatPetScopedRandomLabel(
            owner,
            'Leaf Gecko cursed target',
            attempts + 1,
          ),
          options: targets.map((pet) => ({
            id: `${pet.parent?.isOpponent ? 'O' : 'P'}:${pet.savedPosition + 1}:${pet.name}`,
            label: `${pet.parent?.isOpponent ? 'O' : 'P'}${pet.savedPosition + 1} ${pet.name}`,
          })),
        },
        () => getRandomInt(0, targets.length - 1),
      );
      randomEvent = randomEvent || targetDecision.randomEvent;
      const target = targets[targetDecision.index];

      if (!target) {
        attempts++;
        continue;
      }

      const availableAilments = ailmentNames.filter((ailmentName) =>
        canApplyAilment(target, ailmentName),
      );
      if (availableAilments.length === 0) {
        attempts++;
        continue;
      }

      const ailmentDecision = chooseRandomOption(
        {
          key: 'pet.leaf-gecko-ailment',
          label: formatPetScopedRandomLabel(
            owner,
            `Leaf Gecko ailment for ${target.name}`,
            attempts + 1,
          ),
          options: availableAilments.map((name) => ({ id: name, label: name })),
        },
        () => getRandomInt(0, availableAilments.length - 1),
      );
      randomEvent = randomEvent || ailmentDecision.randomEvent;
      const ailmentName = availableAilments[ailmentDecision.index];
      if (!ailmentName) {
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

      if (
        target.equipment?.name === ailmentName &&
        target.equipment?.equipmentClass?.startsWith('ailment')
      ) {
        appliedCount++;
        appliedDetails.push(
          `${target.name} (${ailmentName}${target.parent !== owner.parent ? ' x2' : ''})`,
        );
      }

      attempts++;
    }

    const message =
      appliedCount > 0
        ? `${owner.name} cursed ${appliedCount} pet${appliedCount === 1 ? '' : 's'}: ${appliedDetails.join(', ')}.`
        : `${owner.name} could not apply any random ailments.`;

    logAbility(this.logService, owner, message, tiger, pteranodon, {
      randomEvent,
    });
    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): LeafGeckoAbility {
    return new LeafGeckoAbility(newOwner, this.logService);
  }
}









