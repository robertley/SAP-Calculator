import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';

const PARROT_COPY_ABOMINATION_SLOTS = [1, 2, 3] as const;

export class Abomination extends Pet {
  name = 'Abomination';
  tier = 4;
  pack: Pack = 'Unicorn';
  attack = 6;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new AbominationAbility(this, this.logService, this.petService),
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
    abominationSwallowedPet1?: string,
    abominationSwallowedPet2?: string,
    abominationSwallowedPet3?: string,
    abominationSwallowedPet1Level?: number,
    abominationSwallowedPet2Level?: number,
    abominationSwallowedPet3Level?: number,
    abominationSwallowedPet1TimesHurt?: number,
    abominationSwallowedPet2TimesHurt?: number,
    abominationSwallowedPet3TimesHurt?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.abominationSwallowedPet1 = abominationSwallowedPet1;
    this.abominationSwallowedPet2 = abominationSwallowedPet2;
    this.abominationSwallowedPet3 = abominationSwallowedPet3;
    this.abominationSwallowedPet1Level = abominationSwallowedPet1Level ?? 1;
    this.abominationSwallowedPet2Level = abominationSwallowedPet2Level ?? 1;
    this.abominationSwallowedPet3Level = abominationSwallowedPet3Level ?? 1;
    this.abominationSwallowedPet1TimesHurt =
      abominationSwallowedPet1TimesHurt ?? 0;
    this.abominationSwallowedPet2TimesHurt =
      abominationSwallowedPet2TimesHurt ?? 0;
    this.abominationSwallowedPet3TimesHurt =
      abominationSwallowedPet3TimesHurt ?? 0;
  }
}


export class AbominationAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'AbominationAbility',
      owner: owner,
      triggers: ['EndTurn', 'SpecialEndTurn'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    const swallowSpots = this.level;
    type SwallowedPetConfig = {
      name?: string | null;
      level: number;
      timesHurt: number;
      belugaSwallowedPet?: string | null;
      parrotCopyPet?: string | null;
      parrotCopyPetBelugaSwallowedPet?: string | null;
      parrotCopyPetAbominationSwallowedPet1?: string | null;
      parrotCopyPetAbominationSwallowedPet2?: string | null;
      parrotCopyPetAbominationSwallowedPet3?: string | null;
      parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet?: string | null;
      parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet?: string | null;
      parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet?: string | null;
      parrotCopyPetAbominationSwallowedPet1Level?: number;
      parrotCopyPetAbominationSwallowedPet2Level?: number;
      parrotCopyPetAbominationSwallowedPet3Level?: number;
      parrotCopyPetAbominationSwallowedPet1TimesHurt?: number;
      parrotCopyPetAbominationSwallowedPet2TimesHurt?: number;
      parrotCopyPetAbominationSwallowedPet3TimesHurt?: number;
    };

    const getOwnerValue = <T>(prop: string, fallback: T): T => {
      const value = (owner as unknown as Record<string, T | null | undefined>)[
        prop
      ];
      return value ?? fallback;
    };

    const buildParrotCopyAbominationConfig = (
      base: string,
    ): Partial<SwallowedPetConfig> => {
      const config: Partial<SwallowedPetConfig> = {};
      for (const slot of PARROT_COPY_ABOMINATION_SLOTS) {
        const slotBase = `parrotCopyPetAbominationSwallowedPet${slot}` as const;
        (config as any)[slotBase] = getOwnerValue<string | null>(
          `${base}ParrotCopyPetAbominationSwallowedPet${slot}`,
          null,
        );
        (config as any)[`${slotBase}BelugaSwallowedPet`] = getOwnerValue<
          string | null
        >(`${base}ParrotCopyPetAbominationSwallowedPet${slot}BelugaSwallowedPet`, null);
        (config as any)[`${slotBase}Level`] = getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet${slot}Level`,
          1,
        );
        (config as any)[`${slotBase}TimesHurt`] = getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet${slot}TimesHurt`,
          0,
        );
      }
      return config;
    };

    const buildParrotCopyAbominationCreateConfig = (
      source: SwallowedPetConfig,
    ): Record<string, string | number | undefined> => {
      const config: Record<string, string | number | undefined> = {};
      for (const slot of PARROT_COPY_ABOMINATION_SLOTS) {
        const slotBase = `parrotCopyPetAbominationSwallowedPet${slot}`;
        config[slotBase] = source[slotBase as keyof SwallowedPetConfig] ?? undefined;
        config[`${slotBase}BelugaSwallowedPet`] =
          source[`${slotBase}BelugaSwallowedPet` as keyof SwallowedPetConfig] ?? undefined;
        config[`${slotBase}Level`] =
          source[`${slotBase}Level` as keyof SwallowedPetConfig] ?? undefined;
        config[`${slotBase}TimesHurt`] =
          source[`${slotBase}TimesHurt` as keyof SwallowedPetConfig] ?? undefined;
      }
      return config;
    };

    const buildSwallowedPetConfig = (slot: 1 | 2 | 3): SwallowedPetConfig => {
      const base = `abominationSwallowedPet${slot}`;
      return {
        name: getOwnerValue<string | null>(base, null),
        level: getOwnerValue<number>(`${base}Level`, 1),
        timesHurt: getOwnerValue<number>(`${base}TimesHurt`, 0),
        belugaSwallowedPet: getOwnerValue<string | null>(
          `${base}BelugaSwallowedPet`,
          null,
        ),
        parrotCopyPet: getOwnerValue<string | null>(
          `${base}ParrotCopyPet`,
          null,
        ),
        parrotCopyPetBelugaSwallowedPet: getOwnerValue<string | null>(
          `${base}ParrotCopyPetBelugaSwallowedPet`,
          null,
        ),
        ...buildParrotCopyAbominationConfig(base),
      };
    };

    const applyParrotCopySettings = (source: SwallowedPetConfig) => {
      owner.parrotCopyPet = source.parrotCopyPet ?? null;
      owner.parrotCopyPetBelugaSwallowedPet =
        source.parrotCopyPetBelugaSwallowedPet ?? null;
      for (const slot of PARROT_COPY_ABOMINATION_SLOTS) {
        const slotBase = `parrotCopyPetAbominationSwallowedPet${slot}`;
        (owner as any)[slotBase] =
          source[slotBase as keyof SwallowedPetConfig] ?? null;
        (owner as any)[`${slotBase}BelugaSwallowedPet`] =
          source[`${slotBase}BelugaSwallowedPet` as keyof SwallowedPetConfig] ??
          null;
        (owner as any)[`${slotBase}Level`] =
          source[`${slotBase}Level` as keyof SwallowedPetConfig] ?? 1;
        (owner as any)[`${slotBase}TimesHurt`] =
          source[`${slotBase}TimesHurt` as keyof SwallowedPetConfig] ?? 0;
      }
    };

    const orderedSwallowedPets: SwallowedPetConfig[] = [
      buildSwallowedPetConfig(1),
      buildSwallowedPetConfig(2),
      buildSwallowedPetConfig(3),
    ];
    const swallowedPets = orderedSwallowedPets
      .filter((pet) => pet.name != null)
      .slice(0, swallowSpots);
    // Tiger repeats only the first swallowed pet's ability.
    let executedSwallowedPets = swallowedPets;
    if (tiger && swallowedPets.length > 0) {
      executedSwallowedPets = swallowedPets.slice(0, 1);
    }
    for (let swallowedPet of executedSwallowedPets) {
      if (!swallowedPet.name) {
        continue;
      }
      const swallowedName = swallowedPet.name;
      const parrotCopyAbominationConfig =
        swallowedName === 'Parrot'
          ? buildParrotCopyAbominationCreateConfig(swallowedPet)
          : {};
      let copyPet = this.petService.createPet(
        {
          attack: 0,
          health: 0,
          mana: 0,
          equipment: null,
          name: swallowedName,
          exp: 0,
          timesHurt: swallowedPet.timesHurt ?? 0,
          belugaSwallowedPet:
            swallowedName === 'Beluga Whale'
              ? (swallowedPet.belugaSwallowedPet ?? undefined)
              : undefined,
          parrotCopyPet:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPet ?? undefined)
              : undefined,
          parrotCopyPetBelugaSwallowedPet:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetBelugaSwallowedPet ?? undefined)
              : undefined,
          ...parrotCopyAbominationConfig,
        },
        owner.parent,
      );

      if (!copyPet) {
        continue;
      }

      if (swallowedName === 'Beluga Whale') {
        owner.belugaSwallowedPet = swallowedPet.belugaSwallowedPet ?? null;
      }

      if (swallowedName === 'Parrot') {
        applyParrotCopySettings(swallowedPet);
      }

      owner.removeAbility('AbominationAbility');
      const abilityCountBefore = owner.abilityList.length;
      owner.gainAbilities(copyPet, 'Pet', swallowedPet.level ?? 1);
      owner.initAbilityUses();

      if (swallowedName === 'Parrot') {
        const newParrotAbilities = owner.abilityList
          .slice(abilityCountBefore)
          .filter((ability) => ability.name === 'ParrotAbility');
        for (const ability of newParrotAbilities) {
          ability.execute(gameApi, triggerPet, tiger, pteranodon);
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AbominationAbility {
    return new AbominationAbility(newOwner, this.logService, this.petService);
  }
}


