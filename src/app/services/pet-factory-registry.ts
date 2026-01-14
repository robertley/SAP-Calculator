import { LogService } from "./log.service";
import { AbilityService } from "./ability.service";
import { GameService } from "./game.service";
import { Player } from "../classes/player.class";
import { Pet } from "../classes/pet.class";
import { GoblinShark } from "../classes/pets/custom/tier-4/goblin-shark.class";
import { RedLippedBatfish } from "../classes/pets/custom/tier-4/red-lipped-batfish.class";
import { Kappa } from "../classes/pets/custom/tier-5/kappa.class";
import { Abomination } from "../classes/pets/unicorn/tier-4/abomination.class";
import { IriomoteCat } from "../classes/pets/danger/tier-1/iriomote-cat.class";
import { Takhi } from "../classes/pets/danger/tier-2/takhi.class";
import { RolowayMonkey } from "../classes/pets/danger/tier-3/roloway-monkey.class";
import { Bonobo } from "../classes/pets/danger/tier-4/bonobo.class";
import { GoldenTamarin } from "../classes/pets/danger/tier-4/golden-tamarin.class";
import { CaliforniaCondor } from "../classes/pets/danger/tier-6/california-condor.class";
import { SilkySifaka } from "../classes/pets/danger/tier-6/silky-sifaka.class";
import { BayCat } from "../classes/pets/danger/tier-6/bay-cat.class";
import { Spider } from "../classes/pets/turtle/tier-2/spider.class";
import { Eagle } from "../classes/pets/puppy/tier-5/eagles.class";
import { Stork } from "../classes/pets/star/tier-2/stork.class";
import { ShimaEnaga } from "../classes/pets/star/tier-2/shima-enaga.class";
import { Parrot } from "../classes/pets/turtle/tier-4/parrot.class";
import { Whale } from "../classes/pets/turtle/tier-4/whale.class";
import { Seagull } from "../classes/pets/custom/tier-4/seagull.class";
import { Pelican } from "../classes/pets/star/tier-5/pelican.class";
import { Falcon } from "../classes/pets/golden/tier-4/falcon.class";
import { BelugaWhale } from "../classes/pets/golden/tier-5/beluga-whale.class";
import { Wolf } from "../classes/pets/golden/tier-5/wolf.class";
import { Pteranodon } from "../classes/pets/golden/tier-6/pteranodon.class";
import { HarpyEagle } from "../classes/pets/custom/tier-6/harpy-eagle.class";
import { SabertoothTiger } from "../classes/pets/star/tier-6/sabertooth-tiger.class";
import { Orca } from "../classes/pets/star/tier-6/orca.class";
import { GoodDog } from "../classes/pets/hidden/good-dog.class";
import { Ammonite } from "../classes/pets/star/tier-6/ammonite.class";
import { Tuna } from "../classes/pets/star/tier-3/tuna.class";
import { Slime } from "../classes/pets/custom/tier-3/slime.class";
import { SarcasticFringehead } from "../classes/pets/custom/tier-3/sarcastic-fringehead.class";
import { Hippogriff } from "../classes/pets/custom/tier-5/hippogriff.class";

export interface PetFactoryDeps {
    logService: LogService;
    abilityService: AbilityService;
    gameService: GameService;
}

// Registry: Pet names -> Classes that need PetService
export const PETS_NEEDING_PETSERVICE: { [key: string]: any } = {
    'Spider': Spider,
    'Whale': Whale,
    'Parrot': Parrot,
    'Stork': Stork,
    'Shima Enaga': ShimaEnaga,
    'Eagle': Eagle,
    'Pelican': Pelican,
    'Falcon': Falcon,
    'Beluga Whale': BelugaWhale,
    'Wolf': Wolf,
    'Pteranodon': Pteranodon,
    'Harpy Eagle': HarpyEagle,
    'Sabertooth Tiger': SabertoothTiger,
    'Orca': Orca,
    'Hippogriff': Hippogriff,
    'Goblin Shark': GoblinShark,
    'Red Lipped Batfish': RedLippedBatfish,
    'Kappa': Kappa,
    'Ammonite': Ammonite,
    'Iriomote Cat': IriomoteCat,
    'Takhi': Takhi,
    'Roloway Monkey': RolowayMonkey,
    'Bonobo': Bonobo,
    'Golden Tamarin': GoldenTamarin,
    'Bay Cat': BayCat,
    'California Condor': CaliforniaCondor,
    'Silky Sifaka': SilkySifaka,
    'Abomination': Abomination,
    'Sarcastic Fringehead': SarcasticFringehead
};

// Registry: Pet names -> Classes that need PetService AND GameService
export const PETS_NEEDING_GAMESERVICE: { [key: string]: any } = {
    'Seagull': Seagull,
    'Good Dog': GoodDog
};

export const PETS_NEEDING_PETSERVICE_TYPES: any[] = [
    GoblinShark, RedLippedBatfish, Kappa, Abomination,
    IriomoteCat, Takhi, RolowayMonkey, Bonobo,
    GoldenTamarin, CaliforniaCondor, SilkySifaka, BayCat,
    Spider, Eagle, Stork, ShimaEnaga, Parrot, Whale,
    Pelican, Falcon, BelugaWhale, Wolf, Pteranodon, HarpyEagle,
    SabertoothTiger, Orca, Ammonite, SarcasticFringehead, Hippogriff
];

export const PETS_NEEDING_GAMESERVICE_TYPES: any[] = [Seagull, GoodDog];

export const SPECIAL_FORM_PET_BUILDERS: { [key: string]: (deps: PetFactoryDeps, petForm: any, parent: Player, petService: any) => Pet } = {
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
            petForm.belugaSwallowedPet
        );
    },
    'Abomination': (deps, petForm, parent, petService) => {
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
            petForm.abominationSwallowedPet3
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
            petForm.timesHurt
        );
    },
    'Tuna': (deps, petForm, parent) => {
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
            petForm.timesHurt
        );
    },
    'Slime': (deps, petForm, parent) => {
        return new Slime(
            deps.logService,
            deps.abilityService,
            parent,
            petForm.health,
            petForm.attack,
            petForm.mana,
            petForm.exp,
            petForm.equipment,
            petForm.triggersConsumed
        );
    }
};
