import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { getRandomInt } from 'app/runtime/random';
import { DANGERS_AND_USEFUL_POOLS } from 'app/domain/dangers-and-useful';


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
      DANGERS_AND_USEFUL_POOLS.iriomoteCat[this.level] ??
      this.petService.allPets.get(this.level) ??
      [];
    if (pool.length === 0) {
      return;
    }

    let randomIndex = getRandomInt(0, pool.length - 1);
    let randomPetName = pool[randomIndex];

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
      randomEvent: true,
    });

    owner.parent.transformPet(owner, transformedPet);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): IriomoteCatAbility {
    return new IriomoteCatAbility(newOwner, this.logService, this.petService);
  }
}







