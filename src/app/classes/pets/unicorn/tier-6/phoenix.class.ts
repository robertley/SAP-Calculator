import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Crisp } from 'app/classes/equipment/ailments/crisp.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { YoungPhoenix } from '../../hidden/young-phoenix.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Phoenix extends Pet {
  name = 'Phoenix';
  tier = 6;
  pack: Pack = 'Unicorn';
  attack = 8;
  health = 8;
  initAbilities(): void {
    this.addAbility(new PhoenixFaintAbility(this, this.logService));
    this.addAbility(
      new PhoenixAfterFaintAbility(this, this.logService, this.abilityService),
    );
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


export class PhoenixAfterFaintAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'PhoenixAfterFaintAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
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
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let power = 4 * this.level;
    let youngPhoenix = new YoungPhoenix(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
      0,
    );

    let summonResult = owner.parent.summonPet(
      youngPhoenix,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} spawned a Young Phoenix (${power}/${power}).`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        sourcePet: owner,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PhoenixAfterFaintAbility {
    return new PhoenixAfterFaintAbility(
      newOwner,
      this.logService,
      this.abilityService,
    );
  }
}


export class PhoenixFaintAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'PhoenixFaintAbility',
      owner: owner,
      triggers: ['Faint'],
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

    let cripsAmt = this.level * 3;
    // Exclude pets that already have Crisp
    let allPets = [...owner.parent.petArray, ...owner.parent.opponent.petArray];
    let petsWithCrisp = allPets.filter((pet) => pet.equipment instanceof Crisp);

    let targetsResp = owner.parent.getRandomPets(
      cripsAmt,
      petsWithCrisp,
      true,
      true,
      owner,
      true,
    );
    let targets = targetsResp.pets;

    if (targets.length > 0) {
      for (let target of targets) {
        this.logService.createLog({
          message: `${owner.name} gave ${target.name} Crisp.`,
          type: 'ability',
          randomEvent: targetsResp.random,
          tiger: tiger,
          player: owner.parent,
        });

        target.givePetEquipment(new Crisp());
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PhoenixFaintAbility {
    return new PhoenixFaintAbility(newOwner, this.logService);
  }
}

