import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { DANGERS_AND_USEFUL_POOLS } from 'app/data/dangers-and-useful';


export class GoldenTamarin extends Pet {
  name = 'Golden Tamarin';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 4;
  health = 4;

  initAbilities(): void {
    this.addAbility(
      new GoldenTamarinAbility(this, this.logService, this.petService),
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


export class GoldenTamarinAbility extends Ability {
  private logService: LogService;
  private petService: PetService;

  constructor(owner: Pet, logService: LogService, petService: PetService) {
    super({
      name: 'GoldenTamarinAbility',
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

    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;

    if (!target) {
      return;
    }

    const petNames = DANGERS_AND_USEFUL_POOLS.goldenTamarin;
    let randomIndex = Math.floor(Math.random() * petNames.length);
    let selectedPetName = petNames[randomIndex];

    let newPet = this.petService.createPet(
      {
        name: selectedPetName,
        health: target.health,
        attack: target.attack,
        mana: target.mana,
        exp: target.exp,
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

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): GoldenTamarinAbility {
    return new GoldenTamarinAbility(newOwner, this.logService, this.petService);
  }
}
