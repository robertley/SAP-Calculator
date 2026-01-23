import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Whale extends Pet {
  name = 'Whale';
  tier = 4;
  pack: Pack = 'Turtle';
  attack = 3;
  health = 7;
  initAbilities(): void {
    this.addAbility(
      new WhaleSwallowAbility(this, this.logService, this.petService),
    );
    this.addAbility(
      new WhaleSummonAbility(this, this.logService, this.abilityService),
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


export class WhaleSummonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'WhaleSummonAbility',
      owner: owner,
      triggers: ['ThisDied'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      ignoreRepeats: true,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    while ((owner as any).swallowedPets.length > 0) {
      let pet = (owner as any).swallowedPets.shift();

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

  copy(newOwner: Pet): WhaleSummonAbility {
    return new WhaleSummonAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


export class WhaleSwallowAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'WhaleSwallowAbility',
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

    let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
    if (targetsAheadResp.pets.length === 0) {
      return;
    }
    let targetPet = targetsAheadResp.pets[0];
    let swallowPet = this.petService.createPet(
      {
        name: targetPet.name,
        attack: targetPet.attack,
        health: targetPet.health,
        exp: owner.exp,
        equipment: null,
        mana: 0,
      },
      owner.parent,
    );
    (owner as any).swallowedPets.push(swallowPet);
    targetPet.health = 0;
    this.logService.createLog({
      message: `${owner.name} swallowed ${targetPet.name}`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      randomEvent: targetsAheadResp.random,
    });

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WhaleSwallowAbility {
    return new WhaleSwallowAbility(newOwner, this.logService, this.petService);
  }
}
