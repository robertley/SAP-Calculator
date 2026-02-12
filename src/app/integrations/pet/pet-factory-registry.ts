import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { Player } from 'app/domain/entities/player.class';
import { Pet } from 'app/domain/entities/pet.class';
import { Equipment } from 'app/domain/entities/equipment.class';
import { GoblinShark } from 'app/domain/entities/catalog/pets/custom/tier-4/goblin-shark.class';
import { RedLippedBatfish } from 'app/domain/entities/catalog/pets/custom/tier-4/red-lipped-batfish.class';
import { Kappa } from 'app/domain/entities/catalog/pets/custom/tier-5/kappa.class';
import { Abomination } from 'app/domain/entities/catalog/pets/unicorn/tier-4/abomination.class';
import { IriomoteCat } from 'app/domain/entities/catalog/pets/danger/tier-1/iriomote-cat.class';
import { Takhi } from 'app/domain/entities/catalog/pets/danger/tier-2/takhi.class';
import { RolowayMonkey } from 'app/domain/entities/catalog/pets/danger/tier-3/roloway-monkey.class';
import { Bonobo } from 'app/domain/entities/catalog/pets/danger/tier-4/bonobo.class';
import { GoldenTamarin } from 'app/domain/entities/catalog/pets/danger/tier-4/golden-tamarin.class';
import { CaliforniaCondor } from 'app/domain/entities/catalog/pets/danger/tier-6/california-condor.class';
import { SilkySifaka } from 'app/domain/entities/catalog/pets/danger/tier-6/silky-sifaka.class';
import { BayCat } from 'app/domain/entities/catalog/pets/danger/tier-6/bay-cat.class';
import { Spider } from 'app/domain/entities/catalog/pets/turtle/tier-2/spider.class';
import { Eagle } from 'app/domain/entities/catalog/pets/puppy/tier-5/eagles.class';
import { Stork } from 'app/domain/entities/catalog/pets/star/tier-2/stork.class';
import { ShimaEnaga } from 'app/domain/entities/catalog/pets/star/tier-2/shima-enaga.class';
import { Parrot } from 'app/domain/entities/catalog/pets/turtle/tier-4/parrot.class';
import { Whale } from 'app/domain/entities/catalog/pets/turtle/tier-4/whale.class';
import { Seagull } from 'app/domain/entities/catalog/pets/custom/tier-4/seagull.class';
import { Pelican } from 'app/domain/entities/catalog/pets/star/tier-5/pelican.class';
import { Falcon } from 'app/domain/entities/catalog/pets/golden/tier-4/falcon.class';
import { BelugaWhale } from 'app/domain/entities/catalog/pets/golden/tier-5/beluga-whale.class';
import { Wolf } from 'app/domain/entities/catalog/pets/golden/tier-5/wolf.class';
import { Pteranodon } from 'app/domain/entities/catalog/pets/golden/tier-6/pteranodon.class';
import { HarpyEagle } from 'app/domain/entities/catalog/pets/custom/tier-6/harpy-eagle.class';
import { SabertoothTiger } from 'app/domain/entities/catalog/pets/star/tier-6/sabertooth-tiger.class';
import { Orca } from 'app/domain/entities/catalog/pets/star/tier-6/orca.class';
import { GoodDog } from 'app/domain/entities/catalog/pets/hidden/good-dog.class';
import { Ammonite } from 'app/domain/entities/catalog/pets/star/tier-6/ammonite.class';
import { Tuna } from 'app/domain/entities/catalog/pets/star/tier-3/tuna.class';
import { Slime } from 'app/domain/entities/catalog/pets/custom/tier-3/slime.class';
import { SarcasticFringehead } from 'app/domain/entities/catalog/pets/custom/tier-3/sarcastic-fringehead.class';
import { Hippogriff } from 'app/domain/entities/catalog/pets/custom/tier-5/hippogriff.class';
import { Leviathan } from 'app/domain/entities/catalog/pets/custom/tier-6/leviathan.class';
import { Tadpole } from 'app/domain/entities/catalog/pets/custom/tier-2/tadpole.class';
import { Stoat } from 'app/domain/entities/catalog/pets/golden/tier-2/stoat.class';
import { PetRegistryMap } from './pet-registry.types';
import { PetForm } from './pet-form.interface';
import type { PetService } from './pet.service';

export interface PetFactoryDeps {
  logService: LogService;
  abilityService: AbilityService;
  gameService: GameService;
}

export type PetFactoryPetService = PetService;

type SpecialBuilderPetForm = PetForm & { equipment?: Equipment | null };

export type SpecialFormPetBuilder = (
  deps: PetFactoryDeps,
  petForm: SpecialBuilderPetForm,
  parent: Player,
  petService: PetFactoryPetService,
) => Pet;

// Registry: Pet names -> Classes that need PetService
export const PETS_NEEDING_PETSERVICE: PetRegistryMap = {
  Spider: Spider,
  Whale: Whale,
  Parrot: Parrot,
  Stork: Stork,
  'Shima Enaga': ShimaEnaga,
  Eagle: Eagle,
  Pelican: Pelican,
  Falcon: Falcon,
  'Beluga Whale': BelugaWhale,
  Wolf: Wolf,
  Pteranodon: Pteranodon,
  'Harpy Eagle': HarpyEagle,
  'Sabertooth Tiger': SabertoothTiger,
  Orca: Orca,
  Hippogriff: Hippogriff,
  'Goblin Shark': GoblinShark,
  'Red Lipped Batfish': RedLippedBatfish,
  Kappa: Kappa,
  Ammonite: Ammonite,
  'Iriomote Cat': IriomoteCat,
  Takhi: Takhi,
  'Roloway Monkey': RolowayMonkey,
  Bonobo: Bonobo,
  'Golden Tamarin': GoldenTamarin,
  'Bay Cat': BayCat,
  'California Condor': CaliforniaCondor,
  'Silky Sifaka': SilkySifaka,
  Abomination: Abomination,
  'Sarcastic Fringehead': SarcasticFringehead,
  Leviathan: Leviathan,
  Tadpole: Tadpole,
  Stoat: Stoat,
};

// Registry: Pet names -> Classes that need PetService AND GameService
export const PETS_NEEDING_GAMESERVICE: PetRegistryMap = {
  Seagull: Seagull,
  'Good Dog': GoodDog,
};

export const PETS_NEEDING_PETSERVICE_TYPES: unknown[] = [
  GoblinShark,
  RedLippedBatfish,
  Kappa,
  Abomination,
  IriomoteCat,
  Takhi,
  RolowayMonkey,
  Bonobo,
  GoldenTamarin,
  CaliforniaCondor,
  SilkySifaka,
  BayCat,
  Spider,
  Eagle,
  Stork,
  ShimaEnaga,
  Parrot,
  Whale,
  Pelican,
  Falcon,
  BelugaWhale,
  Wolf,
  Pteranodon,
  HarpyEagle,
  SabertoothTiger,
  Orca,
  Ammonite,
  SarcasticFringehead,
  Hippogriff,
  Leviathan,
  Tadpole,
  Stoat,
];

export const PETS_NEEDING_GAMESERVICE_TYPES: unknown[] = [
  Seagull,
  GoodDog,
];

export const SPECIAL_FORM_PET_BUILDERS: Record<string, SpecialFormPetBuilder> =
  {
  'Beluga Whale': (deps, petForm, parent, petService) => {
    return new BelugaWhale(
      deps.logService,
      deps.abilityService,
      petService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
      petForm.belugaSwallowedPet,
    );
  },
  Abomination: (deps, petForm, parent, petService) => {
    return new Abomination(
      deps.logService,
      deps.abilityService,
      petService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
      petForm.abominationSwallowedPet1,
      petForm.abominationSwallowedPet2,
      petForm.abominationSwallowedPet3,
      petForm.abominationSwallowedPet1Level,
      petForm.abominationSwallowedPet2Level,
      petForm.abominationSwallowedPet3Level,
      petForm.abominationSwallowedPet1TimesHurt,
      petForm.abominationSwallowedPet2TimesHurt,
      petForm.abominationSwallowedPet3TimesHurt,
    );
  },
  'Sabertooth Tiger': (deps, petForm, parent, petService) => {
    return new SabertoothTiger(
      deps.logService,
      deps.abilityService,
      petService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
      petForm.timesHurt,
    );
  },
  Tuna: (deps, petForm, parent) => {
    return new Tuna(
      deps.logService,
      deps.abilityService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
      petForm.timesHurt,
    );
  },
  Slime: (deps, petForm, parent) => {
    return new Slime(
      deps.logService,
      deps.abilityService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
    );
  },
  };


