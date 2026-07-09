import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getRandomInt } from 'app/runtime/random';
import { chooseRandomOption } from 'app/runtime/random-decision-state';
import { formatPetScopedRandomLabel } from 'app/runtime/random-decision-label';

const IRIOMOTE_CAT_TRANSFORM_POOLS: Record<number, string[]> = {
  1: [
    'Ant',
    'Mosquito',
    'Cricket',
    'Moth',
    'Beetle',
    'Chihuahua',
    'Cockroach',
    'Hummingbird',
    'Frilled Dragon',
    'Farmer Mouse',
    'Budgie',
    'Groundhog',
    'Cone Snail',
    'Goose',
    'Barghest',
    'Tsuchinoko',
    'Alchemedes',
    'Bunyip',
    'Sneaky Egg',
    'Ethiopian Wolf',
    'African Wild Dog',
    'Volcano Snail',
    'Pygmy Seahorse',
    'Nudibranch',
  ],
  2: [
    'Crab',
    'Hedgehog',
    'Flamingo',
    'Spider',
    'Robin',
    'Beluga Sturgeon',
    'Stork',
    'Bass',
    'Panda',
    'Seahorse',
    'Roadrunner',
    'Mink',
    'Meerkat',
    'Black Necked Stilt',
    'Sea Urchin',
    'Honduran White Bat',
    'Frost Wolf',
    'Ogopogo',
    'Thunderbird',
    'Bigfoot',
    'Takhi',
    'White-Bellied Heron',
    'Taita Shrew',
    'Nightcrawler',
    'Pink Robin',
    'Fruit Fly',
    'Olm',
    'Tadpole',
    'Thorny Dragon',
  ],
  3: [
    'Dodo',
    'Dolphin',
    'Sheep',
    'Hoopoe Bird',
    'Pug',
    'Anteater',
    'Eel',
    'Bear',
    'Farmer Pig',
    'Brazillian Treehopper',
    'Flea',
    'Weasel',
    'Osprey',
    'Blue Dragon',
    'Betta Fish',
    'Skeleton Dog',
    'Mandrake',
    'Fur-Bearing Trout',
    'Mana Hound',
    'Roloway Monkey',
    'Amami Rabbit',
    'Hirola',
    'Tucuxi',
    'Tree Kangaroo',
    'Slime',
    'Dimetrodon',
    'Gerenuk',
    'Pangasius',
    'Vampire Parrot',
  ],
};

export class IriomoteCat extends Pet {
  name = 'Iriomote Cat';
  tier = 1;
  pack: Pack = 'Danger';
  attack = 2;
  health = 2;
  initAbilities(): void {
    this.addAbility(
      new IriomoteCatAbility(this, this.logService, this.petService),
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


export class IriomoteCatAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'IriomoteCatAbility',
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
    const owner = this.owner;

    const pool =
      IRIOMOTE_CAT_TRANSFORM_POOLS[this.level] ??
      this.petService.allPets.get(this.level) ??
      [];
    if (pool.length === 0) {
      return;
    }

    const choice = chooseRandomOption(
      {
        key: 'pet.iriomote-cat-transform',
        label: formatPetScopedRandomLabel(owner, 'Iriomote Cat transform'),
        options: pool.map((name) => ({ id: name, label: name })),
      },
      () => getRandomInt(0, pool.length - 1),
    );
    let randomPetName = pool[choice.index];

    let transformedPet = this.petService.createPet(
      {
        name: randomPetName,
        attack: owner.attack,
        health: owner.health,
        exp: 0,
        equipment: owner.equipment,
        mana: owner.mana,
      },
      owner.parent,
    );

    this.logService.createLog({
      message: `${owner.name} transformed into a ${randomPetName} (Level ${transformedPet.level}).`,
      type: 'ability',
      player: owner.parent,
      randomEvent: choice.randomEvent,
    });

    owner.parent.transformPet(owner, transformedPet);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): IriomoteCatAbility {
    return new IriomoteCatAbility(newOwner, this.logService, this.petService);
  }
}







