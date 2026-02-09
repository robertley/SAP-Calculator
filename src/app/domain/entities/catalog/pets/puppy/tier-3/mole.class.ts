import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Mole extends Pet {
  name = 'Mole';
  tier = 3;
  pack: Pack = 'Puppy';
  attack = 2;
  health = 3;
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
  initAbilities(): void {
    this.addAbility(
      new MoleAbility(this, this.logService, this.abilityService),
    );
    super.initAbilities();
  }
}


export class MoleAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'MoleAbility',
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

    let power = this.level * 6;
    let equipmentPets: Pet[] = [];
    for (let pet of owner.parent.petArray) {
      if (pet == owner) {
        continue;
      }
      if (pet.equipment) {
        equipmentPets.push(pet);
      }
    }
    const ownerPos = owner.position;
    equipmentPets.sort((a, b) => {
      const da = Math.abs(a.position - ownerPos);
      const db = Math.abs(b.position - ownerPos);
      if (da !== db) return da - db;
      return a.position - b.position;
    });
    equipmentPets = equipmentPets.slice(0, 2);
    if (equipmentPets.length < 2) {
      return;
    }
    for (let pet of equipmentPets) {
      this.logService.createLog({
        message: `${owner.name} removed ${pet.name}'s equipment.`,
        type: 'ability',
        player: owner.parent,
        pteranodon: pteranodon,
      });
      pet.removePerk();
    }
    let mole = new Mole(
      this.logService,
      this.abilityService,
      owner.parent,
      power,
      power,
    );

    let summonResult = owner.parent.summonPet(
      mole,
      owner.savedPosition,
      false,
      owner,
    );
    if (summonResult.success) {
      this.logService.createLog({
        message: `${owner.name} summoned a ${power}/${power} Mole.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        pteranodon: pteranodon,
        randomEvent: summonResult.randomEvent,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): MoleAbility {
    return new MoleAbility(newOwner, this.logService, this.abilityService);
  }
}



