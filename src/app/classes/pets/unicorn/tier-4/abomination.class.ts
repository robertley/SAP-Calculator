import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


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
        parrotCopyPetAbominationSwallowedPet1: getOwnerValue<string | null>(
          `${base}ParrotCopyPetAbominationSwallowedPet1`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet2: getOwnerValue<string | null>(
          `${base}ParrotCopyPetAbominationSwallowedPet2`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet3: getOwnerValue<string | null>(
          `${base}ParrotCopyPetAbominationSwallowedPet3`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet: getOwnerValue<
          string | null
        >(
          `${base}ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet: getOwnerValue<
          string | null
        >(
          `${base}ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet: getOwnerValue<
          string | null
        >(
          `${base}ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet`,
          null,
        ),
        parrotCopyPetAbominationSwallowedPet1Level: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet1Level`,
          1,
        ),
        parrotCopyPetAbominationSwallowedPet2Level: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet2Level`,
          1,
        ),
        parrotCopyPetAbominationSwallowedPet3Level: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet3Level`,
          1,
        ),
        parrotCopyPetAbominationSwallowedPet1TimesHurt: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet1TimesHurt`,
          0,
        ),
        parrotCopyPetAbominationSwallowedPet2TimesHurt: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet2TimesHurt`,
          0,
        ),
        parrotCopyPetAbominationSwallowedPet3TimesHurt: getOwnerValue<number>(
          `${base}ParrotCopyPetAbominationSwallowedPet3TimesHurt`,
          0,
        ),
      };
    };

    const applyParrotCopySettings = (source: SwallowedPetConfig) => {
      owner.parrotCopyPet = source.parrotCopyPet ?? null;
      owner.parrotCopyPetBelugaSwallowedPet =
        source.parrotCopyPetBelugaSwallowedPet ?? null;
      owner.parrotCopyPetAbominationSwallowedPet1 =
        source.parrotCopyPetAbominationSwallowedPet1 ?? null;
      owner.parrotCopyPetAbominationSwallowedPet2 =
        source.parrotCopyPetAbominationSwallowedPet2 ?? null;
      owner.parrotCopyPetAbominationSwallowedPet3 =
        source.parrotCopyPetAbominationSwallowedPet3 ?? null;
      owner.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet =
        source.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ?? null;
      owner.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet =
        source.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ?? null;
      owner.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet =
        source.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ?? null;
      owner.parrotCopyPetAbominationSwallowedPet1Level =
        source.parrotCopyPetAbominationSwallowedPet1Level ?? 1;
      owner.parrotCopyPetAbominationSwallowedPet2Level =
        source.parrotCopyPetAbominationSwallowedPet2Level ?? 1;
      owner.parrotCopyPetAbominationSwallowedPet3Level =
        source.parrotCopyPetAbominationSwallowedPet3Level ?? 1;
      owner.parrotCopyPetAbominationSwallowedPet1TimesHurt =
        source.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0;
      owner.parrotCopyPetAbominationSwallowedPet2TimesHurt =
        source.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0;
      owner.parrotCopyPetAbominationSwallowedPet3TimesHurt =
        source.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0;
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
          parrotCopyPetAbominationSwallowedPet1:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet1 ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet2:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet2 ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet3:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet3 ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet1Level:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet1Level ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet2Level:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet2Level ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet3Level:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet3Level ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet1TimesHurt:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet1TimesHurt ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet2TimesHurt:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet2TimesHurt ??
                undefined)
              : undefined,
          parrotCopyPetAbominationSwallowedPet3TimesHurt:
            swallowedName === 'Parrot'
              ? (swallowedPet.parrotCopyPetAbominationSwallowedPet3TimesHurt ??
                undefined)
              : undefined,
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
