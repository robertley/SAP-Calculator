import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { getRandomInt } from 'app/runtime/random';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';


export class Stoat extends Pet {
  name = 'Stoat';
  tier = 2;
  pack: Pack = 'Golden';
  attack = 3;
  health = 3;
  initAbilities(): void {
    this.addAbility(
      new StoatAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
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


export class StoatAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
  ) {
    super({
      name: 'StoatAbility',
      owner: owner,
      triggers: ['ThisSold'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
  }

  private executeAbility(context: AbilityContext): void {
    const owner = this.owner;
    const { gameApi } = context;
    const tier = Math.max(1, gameApi.previousShopTier ?? owner.tier);
    const pool = this.petService.allPets.get(tier) ?? [];
    if (!pool.length) {
      this.triggerTigerExecution(context);
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.stoat-summon',
        label: formatPetScopedRandomLabel(owner, 'Stoat summon'),
        options: pool.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, pool.length - 1),
    );
    const petName = pool[choice.index];
    const exp = this.minExpForLevel;
    const summoned = this.petService.createPet(
      {
        name: petName,
        attack: 1,
        health: 1,
        equipment: null,
        exp,
        mana: 0,
      },
      owner.parent,
    );

    const summonResult = owner.parent.summonPet(
      summoned,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a 1/1 level ${this.level} ${summoned.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: context.tiger,
        pteranodon: context.pteranodon,
        randomEvent: choice.randomEvent,
      });
    }
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): StoatAbility {
    return new StoatAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
    );
  }
}


