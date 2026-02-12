import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { PetForm } from 'app/integrations/pet/pet-factory.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { PetMemoryState } from 'app/domain/interfaces/pet-memory.interface';
import {
  PET_MEMORY_SLOTS,
  PetMemoryFieldMap,
  createPetMemorySlotFields,
  readPetMemoryNumber,
  readPetMemoryString,
  writePetMemoryNumber,
  writePetMemoryString,
} from '../../../../pet/pet-memory-fields';

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
    type SwallowedPetConfig = Partial<PetMemoryState> & {
      name?: string | null;
      level: number;
      timesHurt: number;
      belugaSwallowedPet?: string | null;
      parrotCopyPet?: string | null;
      parrotCopyPetBelugaSwallowedPet?: string | null;
    };

    const buildParrotCopyAbominationConfig = (
      slotFields: ReturnType<typeof createPetMemorySlotFields>,
    ): Partial<SwallowedPetConfig> => {
      const config: Partial<SwallowedPetConfig> = {};
      for (const slot of PET_MEMORY_SLOTS) {
        const nestedFields = slotFields.nested(slot);
        const parrotCopySlotFields = createPetMemorySlotFields(
          'parrotCopyPetAbominationSwallowedPet',
          slot,
        );
        config[parrotCopySlotFields.base] = readPetMemoryString(
          owner,
          nestedFields.base,
          null,
        );
        config[parrotCopySlotFields.belugaSwallowedPet] = readPetMemoryString(
          owner,
          nestedFields.belugaSwallowedPet,
          null,
        );
        config[parrotCopySlotFields.level] = readPetMemoryNumber(
          owner,
          nestedFields.level,
          1,
        );
        config[parrotCopySlotFields.timesHurt] = readPetMemoryNumber(
          owner,
          nestedFields.timesHurt,
          0,
        );
      }
      return config;
    };

    const buildParrotCopyAbominationCreateConfig = (
      source: SwallowedPetConfig,
    ): PetMemoryFieldMap => {
      const config: PetMemoryFieldMap = {};
      for (const slot of PET_MEMORY_SLOTS) {
        const slotFields = createPetMemorySlotFields(
          'parrotCopyPetAbominationSwallowedPet',
          slot,
        );
        config[slotFields.base] = source[slotFields.base] ?? undefined;
        config[slotFields.belugaSwallowedPet] =
          source[slotFields.belugaSwallowedPet] ?? undefined;
        config[slotFields.level] = source[slotFields.level] ?? undefined;
        config[slotFields.timesHurt] = source[slotFields.timesHurt] ?? undefined;
      }
      return config;
    };

    const buildSwallowedPetConfig = (slot: 1 | 2 | 3): SwallowedPetConfig => {
      const slotFields = createPetMemorySlotFields('abominationSwallowedPet', slot);
      return {
        name: readPetMemoryString(owner, slotFields.base, null),
        level: readPetMemoryNumber(owner, slotFields.level, 1),
        timesHurt: readPetMemoryNumber(owner, slotFields.timesHurt, 0),
        belugaSwallowedPet: readPetMemoryString(
          owner,
          slotFields.belugaSwallowedPet,
          null,
        ),
        parrotCopyPet: readPetMemoryString(
          owner,
          slotFields.parrotCopyPet,
          null,
        ),
        parrotCopyPetBelugaSwallowedPet: readPetMemoryString(
          owner,
          slotFields.parrotCopyPetBelugaSwallowedPet,
          null,
        ),
        ...buildParrotCopyAbominationConfig(slotFields),
      };
    };

    const applyParrotCopySettings = (source: SwallowedPetConfig) => {
      writePetMemoryString(owner, 'parrotCopyPet', source.parrotCopyPet ?? null);
      writePetMemoryString(
        owner,
        'parrotCopyPetBelugaSwallowedPet',
        source.parrotCopyPetBelugaSwallowedPet ?? null,
      );
      for (const slot of PET_MEMORY_SLOTS) {
        const slotFields = createPetMemorySlotFields(
          'parrotCopyPetAbominationSwallowedPet',
          slot,
        );
        writePetMemoryString(
          owner,
          slotFields.base,
          readPetMemoryString(source, slotFields.base, null),
        );
        writePetMemoryString(
          owner,
          slotFields.belugaSwallowedPet,
          readPetMemoryString(source, slotFields.belugaSwallowedPet, null),
        );
        writePetMemoryNumber(
          owner,
          slotFields.level,
          readPetMemoryNumber(source, slotFields.level, 1),
        );
        writePetMemoryNumber(
          owner,
          slotFields.timesHurt,
          readPetMemoryNumber(source, slotFields.timesHurt, 0),
        );
      }
    };

    const orderedSwallowedPets: SwallowedPetConfig[] = PET_MEMORY_SLOTS.map(
      (slot) => buildSwallowedPetConfig(slot),
    );
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
      const copyPetForm: PetForm = {
        attack: 0,
        health: 0,
        mana: 0,
        equipment: null,
        name: swallowedName,
        exp: 0,
        timesHurt: swallowedPet.timesHurt ?? 0,
        belugaSwallowedPet:
          swallowedName === 'Beluga Whale'
            ? (readPetMemoryString(swallowedPet, 'belugaSwallowedPet', null) ??
              undefined)
            : undefined,
        parrotCopyPet:
          swallowedName === 'Parrot'
            ? (readPetMemoryString(swallowedPet, 'parrotCopyPet', null) ??
              undefined)
            : undefined,
        parrotCopyPetBelugaSwallowedPet:
          swallowedName === 'Parrot'
            ? (readPetMemoryString(
                swallowedPet,
                'parrotCopyPetBelugaSwallowedPet',
                null,
              ) ?? undefined)
            : undefined,
      };
      Object.assign(copyPetForm, parrotCopyAbominationConfig);
      let copyPet = this.petService.createPet(copyPetForm, owner.parent);

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


