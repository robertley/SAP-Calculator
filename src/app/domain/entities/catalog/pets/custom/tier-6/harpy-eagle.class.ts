import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class HarpyEagle extends Pet {
  name = 'Harpy Eagle';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new HarpyEagleAbility(this, this.logService, this.petService),
    );
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
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


export class HarpyEagleAbility extends Ability {
  private logService: LogService;
  private petService: PetService;
  private usesThisTurn = 0;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'HarpyEagleAbility',
      owner: owner,
      triggers: ['ThisHurt'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    if (context.trigger !== 'ThisHurt') {
      return;
    }

    if (this.usesThisTurn >= 3) {
      return;
    }

    this.usesThisTurn++;

    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = this.level * 5;
    const normalizePool = (pool?: string[]) =>
      (pool ?? []).filter(
        (petName) =>
          petName &&
          owner.name &&
          petName.toLowerCase() !== owner.name.toLowerCase(),
      );

    const activePool =
      owner.parent === gameApi.player
        ? gameApi.playerPetPool
        : gameApi.opponentPetPool;
    let tierOnePool = normalizePool(activePool?.get(1));
    if (!tierOnePool.length) {
      tierOnePool = normalizePool(this.petService.allPets.get(1));
    }
    if (!tierOnePool.length) {
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.harpy-eagle-hurt-summon',
        label: formatPetScopedRandomLabel(owner, 'Harpy Eagle hurt summon'),
        options: tierOnePool.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, tierOnePool.length - 1),
    );
    let petName = tierOnePool[choice.index];
    let summonPet = this.petService.createPet(
      {
        name: petName,
        attack: power,
        health: power,
        equipment: null,
        mana: 0,
        exp: 0,
      },
      owner.parent,
    );

    let summonResult = owner.parent.summonPet(
      summonPet,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned ${summonPet.name} (${power}/${power}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: choice.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): HarpyEagleAbility {
    return new HarpyEagleAbility(newOwner, this.logService, this.petService);
  }
}


