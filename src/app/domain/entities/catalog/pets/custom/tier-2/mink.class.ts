import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from 'app/domain/entities/equipment.class';
import { Pack, Pet } from 'app/domain/entities/pet.class';
import { Player } from 'app/domain/entities/player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { InjectorService } from 'app/integrations/injector.service';
import { getRandomInt } from 'app/runtime/random';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Mink extends Pet {
  name = 'Mink';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 3;
  health = 3;

  override initAbilities(): void {
    this.addAbility(new MinkAbility(this, this.logService));
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

export class MinkAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'MinkAbility',
      owner: owner,
      triggers: ['StartBattle'],
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
    const previousTier = Math.max(1, (owner.tier ?? 1) - 1);
    const perks = equipmentService.getUsefulPerksByTier(previousTier);

    if (perks.length === 0) {
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.mink-perk',
        label: formatPetScopedRandomLabel(owner, 'Mink perk'),
        options: perks.map((perk) => ({
          id: perk.name,
          label: perk.name,
        })),
      },
      () => getRandomInt(0, perks.length - 1),
    );
    const perk = perks[choice.index];

    if (!perk) {
      return;
    }

    owner.givePetEquipment(perk, this.level);

    this.logService.createLog({
      message: `${owner.name} gained ${perk.name} before battle.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: choice.randomEvent,
    });

    this.triggerTigerExecution(context);
  }

  override copy(newOwner: Pet): MinkAbility {
    return new MinkAbility(newOwner, this.logService);
  }
}


