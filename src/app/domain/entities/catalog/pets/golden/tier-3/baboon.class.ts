import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Baboon extends Pet {
  name = 'Baboon';
  tier = 3;
  pack: Pack = 'Golden';
  attack = 2;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new BaboonAbility(this, this.logService, this.abilityService),
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


export class BaboonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'BaboonAbility',
      owner: owner,
      triggers: ['EndTurn'],
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
    const owner = this.owner;
    const { gameApi } = context;
    const currentTier = Math.max(1, gameApi.previousShopTier ?? owner.tier);
    const candidates = owner.parent.petArray.filter(
      (pet) => pet.alive && pet.tier >= currentTier,
    );
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.baboon-end-turn-target',
        label: formatPetScopedRandomLabel(owner, 'Baboon end turn target'),
        options: candidates.map((pet) => ({
          id: `${pet.savedPosition + 1}:${pet.name}`,
          label: `P${pet.savedPosition + 1} ${pet.name}`,
        })),
      },
      () => getRandomInt(0, candidates.length - 1),
    );
    const target = candidates[choice.index];
    const buff = this.level;
    target.increaseAttack(buff);
    target.increaseHealth(buff);

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buff}/+${buff}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: choice.randomEvent,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): BaboonAbility {
    return new BaboonAbility(newOwner, this.logService, this.abilityService);
  }
}


