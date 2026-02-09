import { GameAPI } from 'app/domain/interfaces/gameAPI.interface';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { shuffle } from 'app/runtime/random';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Komodo extends Pet {
  name = 'Komodo';
  tier = 6;
  pack: Pack = 'Custom';
  attack = 6;
  health = 6;
  initAbilities(): void {
    this.addAbility(
      new KomodoAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
  endTurn(gameApi: GameAPI): void {
    if (!gameApi.komodoShuffle) {
      return;
    }

    let start = 0;
    let end = this.position;
    if (end == 0) {
      return;
    }

    let shuffledPets = this.shufflePets(start, end);
    let shuffledPetNames = shuffledPets.map((pet) => pet.name).join(', ');

    this.logService.createLog({
      message: `${this.name} shuffled positions of pets (${shuffledPetNames}).`,
      type: 'ability',
      player: this.parent,
      randomEvent: true,
    });
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

  shufflePets(start: number, end: number) {
    let pets = this.parent.petArray.slice(start, end);
    shuffle(pets);
    for (let i = 0; i < pets.length; i++) {
      this.parent[`pet${i}`] = pets[i];
    }
    return pets;
  }
}


export class KomodoAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'KomodoAbility',
      owner: owner,
      triggers: ['EndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, tiger, pteranodon } = context;
    const owner = this.owner;
    if (owner.position === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const targetsResp = owner.parent.nearestPetsAhead(owner.position, owner);
    const targets = targetsResp.pets;
    if (targets.length === 0) {
      this.triggerTigerExecution(context);
      return;
    }

    const buffAmount = this.level;
    for (const target of targets) {
      target.increaseAttack(buffAmount);
      target.increaseHealth(buffAmount);
    }

    if (gameApi) {
      gameApi.komodoShuffle = true;
    }

    const names = targets.map((p) => p.name).join(', ');
    this.logService.createLog({
      message: `${owner.name} gave ${names} +${buffAmount}/+${buffAmount} at end of turn and shuffled positions.`,
      type: 'ability',
      player: owner.parent,
      tiger,
      pteranodon,
      randomEvent: true,
    });

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KomodoAbility {
    return new KomodoAbility(newOwner, this.logService, this.abilityService);
  }
}






