import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Ostrich extends Pet {
  name = 'Ostrich';
  tier = 6;
  pack: Pack = 'Star';
  attack = 6;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new OstrichAbility(this, this.logService, this.abilityService),
    );
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


export class OstrichAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private usesThisTurn = 0;
  private readonly maxUsesPerTurn = 4;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'OstrichAbility',
      owner: owner,
      triggers: ['Roll', 'StartTurn'],
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
    if (context.trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      this.triggerTigerExecution(context);
      return;
    }

    if (this.usesThisTurn >= this.maxUsesPerTurn) {
      this.triggerTigerExecution(context);
      return;
    }

    const shopPets = (context as { shopPets?: Array<{ tier?: number }> })
      .shopPets;
    const shopPetTiers = (context as { shopPetTiers?: number[] }).shopPetTiers;

    const tiers =
      shopPetTiers ??
      shopPets?.map((pet) => (typeof pet?.tier === 'number' ? pet.tier : null));
    if (!tiers || tiers.length < 4) {
      this.triggerTigerExecution(context);
      return;
    }

    const firstTier = tiers[0];
    if (firstTier == null || !tiers.slice(0, 4).every((tier) => tier === firstTier)) {
      this.triggerTigerExecution(context);
      return;
    }

    this.usesThisTurn++;
    const owner = this.owner;
    const healthGain = this.level * 2;
    const targets = owner.parent.petArray.filter((pet) => pet.alive);
    for (const target of targets) {
      target.increaseHealth(healthGain);
    }

    this.logService.createLog({
      message: `${owner.name} re-rolled the shop and gave friends +${healthGain} health.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): OstrichAbility {
    return new OstrichAbility(newOwner, this.logService, this.abilityService);
  }
}


