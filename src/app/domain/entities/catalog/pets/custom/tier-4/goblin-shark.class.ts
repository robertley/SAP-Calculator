import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class GoblinShark extends Pet {
  name = 'Goblin Shark';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 6;
  health = 3;

  initAbilities(): void {
    this.addAbility(
      new GoblinSharkStartAbility(this, this.logService, this.petService),
    );
    this.addAbility(
      new GoblinSharkFaintAbility(this, this.logService, this.abilityService),
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


export class GoblinSharkFaintAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'GoblinSharkFaintAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.alive;
      },
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
      pet.health = 1;
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

  copy(newOwner: Pet): GoblinSharkFaintAbility {
    return new GoblinSharkFaintAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


export class GoblinSharkStartAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'GoblinSharkStartAbility',
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

    let swallowThreshold = this.level * 6;

    // Loop through enemy pets from front to back to find first swallowable target
    for (let targetPet of owner.parent.opponent.petArray) {
      if (!targetPet.alive) {
        continue;
      }

      if (targetPet.health <= swallowThreshold) {
        // Create a copy of the target pet to swallow
        let swallowPet = this.petService.createPet(
          {
            name: targetPet.name,
            attack: targetPet.attack,
            health: targetPet.health,
            exp: targetPet.exp,
            equipment: null,
            mana: 0,
          },
          owner.parent,
        );

        owner.swallowedPets.push(swallowPet);
        targetPet.health = 0;

        this.logService.createLog({
          message: `${owner.name} swallowed ${targetPet.name}`,
          type: 'ability',
          player: owner.parent,
          tiger: tiger,
          pteranodon: pteranodon,
        });
        break; // Stop after swallowing one pet
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GoblinSharkStartAbility {
    return new GoblinSharkStartAbility(
      newOwner,
      this.logService,
      this.petService,
    );
  }
}



