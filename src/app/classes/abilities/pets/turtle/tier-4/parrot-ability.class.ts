import { Ability, AbilityContext } from '../../../../ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { Pet } from '../../../../pet.class';
import { LogService } from 'app/services/log.service';
import { PetService } from 'app/services/pet/pet.service';

export class ParrotAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'ParrotAbility',
      owner: owner,
      triggers: ['BeforeStartBattle'],
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
    let owner = this.owner;
    const useSavedCopy =
      owner.parrotCopyPet != null && owner.parrotCopyPet !== '';
    const copyPetName = useSavedCopy
      ? owner.parrotCopyPet
      : (owner.petAhead?.name ?? null);
    const belugaSwallowedPet = useSavedCopy
      ? owner.parrotCopyPetBelugaSwallowedPet
      : null;
    const slots = [1, 2, 3] as const;
    const getOwnerValue = <T>(prop: string, fallback: T): T => {
      const value = (owner as unknown as Record<string, T | null | undefined>)[
        prop
      ];
      return value ?? fallback;
    };
    const buildAbominationSwallowFields = () => {
      const fields: Record<string, string | number | null | undefined> = {};
      for (const slot of slots) {
        const base = `parrotCopyPetAbominationSwallowedPet${slot}`;
        fields[`abominationSwallowedPet${slot}`] = getOwnerValue<string | null>(
          base,
          null,
        );
        fields[`abominationSwallowedPet${slot}BelugaSwallowedPet`] =
          getOwnerValue<string | null>(`${base}BelugaSwallowedPet`, null);
        fields[`abominationSwallowedPet${slot}Level`] = getOwnerValue<number>(
          `${base}Level`,
          1,
        );
        fields[`abominationSwallowedPet${slot}TimesHurt`] =
          getOwnerValue<number>(`${base}TimesHurt`, 0);
        fields[`abominationSwallowedPet${slot}ParrotCopyPet`] = getOwnerValue<
          string | null
        >(`${base}ParrotCopyPet`, null);
        fields[
          `abominationSwallowedPet${slot}ParrotCopyPetBelugaSwallowedPet`
        ] = getOwnerValue<string | null>(
          `${base}ParrotCopyPetBelugaSwallowedPet`,
          null,
        );
        for (const nestedSlot of slots) {
          const nestedBase = `${base}ParrotCopyPetAbominationSwallowedPet${nestedSlot}`;
          fields[
            `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${nestedSlot}`
          ] = getOwnerValue<string | null>(nestedBase, null);
          fields[
            `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${nestedSlot}BelugaSwallowedPet`
          ] = getOwnerValue<string | null>(
            `${nestedBase}BelugaSwallowedPet`,
            null,
          );
          fields[
            `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${nestedSlot}Level`
          ] = getOwnerValue<number>(`${nestedBase}Level`, 1);
          fields[
            `abominationSwallowedPet${slot}ParrotCopyPetAbominationSwallowedPet${nestedSlot}TimesHurt`
          ] = getOwnerValue<number>(`${nestedBase}TimesHurt`, 0);
        }
      }
      return fields;
    };
    if (!copyPetName) {
      return;
    }
    const abominationFields =
      copyPetName === 'Abomination' && useSavedCopy
        ? buildAbominationSwallowFields()
        : {};
    let copyPet = this.petService.createPet(
      {
        name: copyPetName,
        attack: null,
        health: null,
        mana: null,
        exp: owner.exp ?? 0,
        equipment: null,
        belugaSwallowedPet:
          copyPetName === 'Beluga Whale'
            ? (belugaSwallowedPet ?? null)
            : undefined,
        ...abominationFields,
      },
      owner.parent,
    );
    if (copyPet == null) {
      return;
    }
    if (copyPetName === 'Abomination') {
      Object.assign(owner, abominationFields);
    }
    if (copyPetName === 'Beluga Whale') {
      owner.belugaSwallowedPet = belugaSwallowedPet ?? null;
    }
    owner.copyAbilities(copyPet, 'Pet', owner.level);
    owner.initAbilityUses();
    if (copyPetName === 'Abomination') {
      const abominationAbilities = owner.abilityList.filter(
        (ability) => ability.name === 'AbominationAbility',
      );
      for (const ability of abominationAbilities) {
        ability.execute(gameApi, triggerPet, tiger, pteranodon);
      }
    }
    this.logService.createLog({
      message: `${owner.name} copied ${copyPet.name}`,
      type: 'ability',
      player: owner.parent,
    });
  }

  copy(newOwner: Pet): ParrotAbility {
    return new ParrotAbility(newOwner, this.logService, this.petService);
  }
}
