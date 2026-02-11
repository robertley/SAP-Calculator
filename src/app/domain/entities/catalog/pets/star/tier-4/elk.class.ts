import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Elk extends Pet {
  name = 'Elk';
  tier = 4;
  pack: Pack = 'Star';
  attack = 2;
  health = 6;
  initAbilities(): void {
    this.addAbility(new ElkAbility(this, this.logService, this.abilityService));
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


export class ElkAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'ElkAbility',
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
    const candidates = owner.parent.petArray.filter(
      (pet) => pet.alive && pet.isSellPet(),
    );
    if (candidates.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.elk-end-turn-target',
        label: formatPetScopedRandomLabel(owner, 'Elk end turn sell target'),
        options: candidates.map((pet) => ({
          id: `${pet.savedPosition + 1}:${pet.name}`,
          label: `P${pet.savedPosition + 1} ${pet.name}`,
        })),
      },
      () => getRandomInt(0, candidates.length - 1),
    );
    const target = candidates[choice.index];
    const sellValueGain = this.level * 2;
    target.increaseSellValue(sellValueGain);
    this.logService.createLog({
      message: `${owner.name} increased ${target.name}'s sell value by ${sellValueGain}.`,
      type: 'ability',
      player: owner.parent,
      tiger: context.tiger,
      pteranodon: context.pteranodon,
      randomEvent: choice.randomEvent,
    });
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): ElkAbility {
    return new ElkAbility(newOwner, this.logService, this.abilityService);
  }
}


