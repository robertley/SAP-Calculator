import { PetService } from 'app/integrations/pet/pet.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetForm } from 'app/integrations/pet/pet-factory.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import {
  PET_MEMORY_SLOTS,
  PetMemoryFieldMap,
  createPetMemorySlotFields,
  readPetMemoryNumber,
  readPetMemoryString,
} from '../../../../pet/pet-memory-fields';

export class Parrot extends Pet {
  name = 'Parrot';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 4;
  health = 2;
  initAbilities(): void {
    this.addAbility(new ParrotAbility(this, this.logService, this.petService));
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
      ? readPetMemoryString(owner, 'parrotCopyPet', null)
      : (owner.petAhead?.name ?? null);
    const belugaSwallowedPet = useSavedCopy
      ? readPetMemoryString(owner, 'parrotCopyPetBelugaSwallowedPet', null)
      : null;
    const buildAbominationSwallowFields = (): PetMemoryFieldMap => {
      const fields: PetMemoryFieldMap = {};
      for (const slot of PET_MEMORY_SLOTS) {
        const sourceFields = createPetMemorySlotFields(
          'parrotCopyPetAbominationSwallowedPet',
          slot,
        );
        const targetFields = createPetMemorySlotFields(
          'abominationSwallowedPet',
          slot,
        );

        fields[targetFields.base] = readPetMemoryString(
          owner,
          sourceFields.base,
          null,
        );
        fields[targetFields.belugaSwallowedPet] = readPetMemoryString(
          owner,
          sourceFields.belugaSwallowedPet,
          null,
        );
        fields[targetFields.level] = readPetMemoryNumber(
          owner,
          sourceFields.level,
          1,
        );
        fields[targetFields.timesHurt] = readPetMemoryNumber(
          owner,
          sourceFields.timesHurt,
          0,
        );
        fields[targetFields.parrotCopyPet] = readPetMemoryString(
          owner,
          sourceFields.parrotCopyPet,
          null,
        );
        fields[targetFields.parrotCopyPetBelugaSwallowedPet] =
          readPetMemoryString(
            owner,
            sourceFields.parrotCopyPetBelugaSwallowedPet,
            null,
          );

        for (const nestedSlot of PET_MEMORY_SLOTS) {
          const sourceNestedFields = sourceFields.nested(nestedSlot);
          const targetNestedFields = targetFields.nested(nestedSlot);
          fields[targetNestedFields.base] = readPetMemoryString(
            owner,
            sourceNestedFields.base,
            null,
          );
          fields[targetNestedFields.belugaSwallowedPet] = readPetMemoryString(
            owner,
            sourceNestedFields.belugaSwallowedPet,
            null,
          );
          fields[targetNestedFields.level] = readPetMemoryNumber(
            owner,
            sourceNestedFields.level,
            1,
          );
          fields[targetNestedFields.timesHurt] = readPetMemoryNumber(
            owner,
            sourceNestedFields.timesHurt,
            0,
          );
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
    const copyPetForm: PetForm = {
      name: copyPetName,
      attack: null,
      health: null,
      mana: null,
      exp: owner.exp ?? 0,
      equipment: null,
      belugaSwallowedPet:
        copyPetName === 'Beluga Whale'
          ? (readPetMemoryString(
              { belugaSwallowedPet },
              'belugaSwallowedPet',
              null,
            ) ?? null)
          : undefined,
    };
    Object.assign(copyPetForm, abominationFields);
    let copyPet = this.petService.createPet(copyPetForm, owner.parent);
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


