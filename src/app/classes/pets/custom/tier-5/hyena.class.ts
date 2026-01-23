import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { shuffle } from 'app/util/helper-functions';


export class Hyena extends Pet {
  name = 'Hyena';
  tier = 5;
  pack: Pack = 'Custom';
  attack = 5;
  health = 5;
  initAbilities(): void {
    this.addAbility(new HyenaAbility(this, this.logService));
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
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


export class HyenaAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'HyenaAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    switch (this.level) {
      case 1:
        this.level1Ability(gameApi, tiger, pteranodon);
        break;
      case 2:
        this.level2Ability(gameApi, tiger, pteranodon);
        break;
      case 3:
        this.level3Ability(gameApi, tiger, pteranodon);
        break;
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  private level1Ability(
    gameApi: GameAPI,
    tiger?: boolean,
    pteranodon?: boolean,
  ): void {
    const owner = this.owner;
    let allPetsResp = owner.parent.getAll(true, owner);
    for (let pet of allPetsResp.pets) {
      let health = pet.health;
      let attack = pet.attack;
      pet.health = attack;
      pet.attack = health;
    }
    this.logService.createLog({
      message: `${owner.name} swapped all pets attack and health.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
    });
  }

  private level2Ability(
    gameApi: GameAPI,
    tiger?: boolean,
    pteranodon?: boolean,
  ): void {
    const owner = this.owner;
    this.shufflePets(gameApi.player);
    this.shufflePets(gameApi.opponent);
    this.logService.createLog({
      message: `${owner.name} shuffled positions of all pets.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
      pteranodon: pteranodon,
      randomEvent: true,
    });
  }

  private level3Ability(
    gameApi: GameAPI,
    tiger?: boolean,
    pteranodon?: boolean,
  ): void {
    this.level1Ability(gameApi, tiger, pteranodon);
    this.level2Ability(gameApi, tiger, pteranodon);
  }

  private shufflePets(player: any) {
    let pets = player.petArray;
    shuffle(pets);
    for (let i = 0; i < pets.length; i++) {
      player[`pet${i}`] = pets[i];
    }
  }

  copy(newOwner: Pet): HyenaAbility {
    return new HyenaAbility(newOwner, this.logService);
  }
}
