import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { PetService } from 'app/integrations/pet/pet.service';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { DANGERS_AND_USEFUL_POOLS } from 'app/domain/dangers-and-useful';


export class RolowayMonkey extends Pet {
  name = 'Roloway Monkey';
  tier = 3;
  pack: Pack = 'Danger';
  attack = 2;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new RolowayMonkeyAbility(this, this.logService, this.petService),
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


export class RolowayMonkeyAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'RolowayMonkeyAbility',
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

    let targetResp = owner.parent.nearestPetsAhead(2, owner);
    if (targetResp.pets.length === 0) {
      return;
    }

    // Pool of useful hurt pets to transform into
    const petNames = DANGERS_AND_USEFUL_POOLS.rolowayMonkey;

    for (let target of targetResp.pets) {
      let randomIndex = Math.floor(Math.random() * petNames.length);
      let selectedPetName = petNames[randomIndex];

      let newPet = this.petService.createPet(
        {
          name: selectedPetName,
          health: target.health,
          attack: target.attack,
          mana: target.mana,
          exp: owner.exp,
          equipment: target.equipment,
        },
        owner.parent,
      );

      owner.parent.transformPet(target, newPet);

      this.logService.createLog({
        message: `${owner.name} transformed ${target.name} into a ${newPet.attack}/${newPet.health} ${newPet.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: true,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): RolowayMonkeyAbility {
    return new RolowayMonkeyAbility(newOwner, this.logService, this.petService);
  }
}



