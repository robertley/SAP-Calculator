import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from 'app/classes/equipment.class';
import { Pack, Pet } from 'app/classes/pet.class';
import { Player } from 'app/classes/player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { InjectorService } from 'app/services/injector.service';
import { PetService } from 'app/services/pet/pet.service';
import { BASE_PACK_NAMES, BasePackName } from 'app/util/pack-names';
import * as foodJson from 'assets/data/food.json';

const PACK_CODE_TO_NAME: Record<string, Pack> = {
  Pack1: 'Turtle',
  Pack2: 'Puppy',
  Pack3: 'Star',
  Pack4: 'Golden',
  Pack5: 'Unicorn',
  Danger: 'Danger',
  Custom: 'Custom',
  MiniPack1: 'Custom',
  MiniPack2: 'Custom',
  MiniPack3: 'Custom',
};

const FOOD_PACKS_BY_NAME: Map<string, Set<Pack>> = new Map();
const foodEntries = (foodJson as unknown as { default?: any[] }).default ?? (foodJson as any[]);
if (Array.isArray(foodEntries)) {
  for (const food of foodEntries) {
    if (!food?.Name) {
      continue;
    }
    const packs = new Set<Pack>();
    for (const code of food.Packs ?? []) {
      const packName = PACK_CODE_TO_NAME[code];
      if (packName) {
        packs.add(packName);
      }
    }
    if (packs.size > 0) {
      FOOD_PACKS_BY_NAME.set(food.Name, packs);
    }
  }
}


export class Tanystropheus extends Pet {
  name = 'Tanystropheus';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 6;

  override initAbilities(): void {
    this.addAbility(new TanystropheusAbility(this, this.logService));
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


export class TanystropheusAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'Tanystropheus Ability',
      owner: owner,
      triggers: ['BeforeStartBattle'],
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
    const activePackName = owner.parent.pack;

    const petService = InjectorService.getInjector().get(PetService);
    const hasPetFromTab = owner.parent.petArray.some((pet) =>
      this.isPetInActivePack(pet, activePackName, petService),
    );
    const hasFoodFromTab = owner.parent.petArray.some((pet) =>
      this.isFoodInActivePack(pet.equipment?.name, activePackName),
    );

    if (hasPetFromTab || hasFoodFromTab) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetsResp = owner.parent.getRandomEnemyPetsWithSillyFallback(
      3,
      [],
      false,
      true,
      owner,
    );
    const targets = targetsResp.pets;
    if (!targets.length) {
      this.triggerTigerExecution(context);
      return;
    }

    const expLoss = this.level;
    for (const target of targets) {
      if (!target) {
        continue;
      }
      const currentExp = target.exp ?? 0;
      target.exp = Math.max(0, currentExp - expLoss);
    }

    this.logService.createLog({
      message: `${owner.name} removed ${expLoss} XP from ${targets.map((pet) => pet.name).join(', ')}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: targetsResp.random,
    });

    this.triggerTigerExecution(context);
  }

  private isPetInActivePack(
    pet: Pet,
    activePackName: string,
    petService: PetService,
  ): boolean {
    if (!petService) {
      return pet.pack === activePackName;
    }

    if (BASE_PACK_NAMES.includes(activePackName as BasePackName)) {
      const tierPets =
        petService.basePackPetsByName[activePackName as BasePackName]?.get(
          pet.tier,
        ) ?? [];
      return tierPets.includes(pet.name);
    }

    const customPack = petService.playerCustomPackPets.get(activePackName);
    if (customPack) {
      return customPack.get(pet.tier)?.includes(pet.name) ?? false;
    }

    return pet.pack === activePackName;
  }

  private isFoodInActivePack(
    equipmentName: string | undefined,
    activePackName: string,
  ): boolean {
    if (!equipmentName) {
      return false;
    }
    const packs = FOOD_PACKS_BY_NAME.get(equipmentName);
    if (!packs) {
      return false;
    }
    return packs.has(activePackName as Pack);
  }

  override copy(newOwner: Pet): TanystropheusAbility {
    return new TanystropheusAbility(newOwner, this.logService);
  }
}
