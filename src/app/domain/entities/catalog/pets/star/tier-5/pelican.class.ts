import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Pelican extends Pet {
  name = 'Pelican';
  tier = 5;
  pack: Pack = 'Star';
  attack = 5;
  health = 5;

  initAbilities(): void {
    this.addAbility(
      new PelicanStartAbility(this, this.logService, this.petService),
    );
    this.addAbility(
      new PelicanFaintAbility(this, this.logService, this.abilityService),
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


export class PelicanFaintAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PelicanFaintAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
      ignoreRepeats: true,
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    while (owner.swallowedPets.length > 0) {
      let pet = owner.swallowedPets.shift();
      let summonResult = owner.parent.summonPet(
        pet,
        owner.savedPosition,
        false,
        owner,
      );
      if (summonResult.success) {
        this.logService.createLog({
          message: `${owner.name} summoned ${pet.name} (level ${pet.level}).`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
          randomEvent: summonResult.randomEvent,
        });
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PelicanFaintAbility {
    return new PelicanFaintAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


export class PelicanStartAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'PelicanStartAbility',
      owner: owner,
      triggers: ['StartBattle'],
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

    let excludePets = owner.parent.getPetsWithoutEquipment('Strawberry');
    let targetsAheadResp = owner.parent.nearestPetsAhead(
      this.level,
      owner,
      excludePets,
    );
    let targets = targetsAheadResp.pets;
    if (targets.length == 0) {
      return;
    }

    for (let currentPet of targets) {
      // Create Salmon copy to swallow (transform the swallowed pet into Salmon)
      let salmon = this.petService.createPet(
        {
          name: 'Salmon',
          attack: currentPet.attack,
          health: currentPet.health,
          exp: currentPet.exp,
          equipment: null,
          mana: 0,
        },
        owner.parent,
      );

      owner.swallowedPets.push(salmon);
      currentPet.health = 0;

      this.logService.createLog({
        message: `${owner.name} swallowed ${currentPet.name}`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetsAheadResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PelicanStartAbility {
    return new PelicanStartAbility(newOwner, this.logService, this.petService);
  }
}



