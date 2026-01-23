import { GameAPI } from 'app/interfaces/gameAPI.interface';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { LogService } from 'app/services/log.service';
import { ToyService } from 'app/services/toy/toy.service';
import { Cold } from 'app/classes/equipment/ailments/cold.class';
import { Crisp } from 'app/classes/equipment/ailments/crisp.class';
import { Dazed } from 'app/classes/equipment/ailments/dazed.class';
import { Icky } from 'app/classes/equipment/ailments/icky.class';
import { Spooked } from 'app/classes/equipment/ailments/spooked.class';
import { Toasty } from 'app/classes/equipment/ailments/toasty.class';
import { Weak } from 'app/classes/equipment/ailments/weak.class';
import { Player } from '../../player.class';
import { Toy } from '../../toy.class';
import { isRollablePerk } from 'app/services/equipment/unrollable-perks';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { Pet } from '../../pet.class';
import { AbilityService } from 'app/services/ability/ability.service';
import { getOpponent } from 'app/util/helper-functions';
import { cloneEquipment } from 'app/util/equipment-utils';


// Equipment effects are now multiplied by toy level via Equipment.getMultiplier()

export class PandorasBox extends Toy {
  name = 'Pandoras Box';
  tier = 5;
  startOfBattle(gameApi?: GameAPI, puma?: boolean) {
    let equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
    let ailments = [
      new Cold(),
      new Crisp(),
      new Dazed(),
      new Icky(),
      // new Ink(), // excluded
      new Spooked(),
      new Toasty(),
      new Weak(),
    ];

    // https://superautopets.wiki.gg/wiki/Pandoras_Box
    const excludedPerks = new Set<string>([
      'Cake Slice',
      'Carrot',
      'Cherry',
      'Chocolate Cake',
      'Coconut',
      'Croissant',
      'Cucumber',
      'Eggplant',
      'Fig',
      'Gingerbread Man',
      'Grapes',
      'Golden Egg',
      'Health Potion',
      'Love Potion',
      'Magic Beans',
      'Peanut',
      'Pie',
      'Rambutan',
      'Rice',
      'Skewer',
    ]);
    let pets = [...gameApi.player.petArray, ...gameApi.opponent.petArray];

    let equipments = Array.from(equipmentMap.values());
    equipments = equipments.filter(
      (equipment) => !excludedPerks.has(equipment.name) && isRollablePerk(equipment),
    );

    for (let pet of pets) {
      // 50% chance for pool to be ailments
      let perkPool = ailments;
      if (Math.random() < 0.5) {
        perkPool = equipments;
      }
      let equipment = perkPool[Math.floor(Math.random() * perkPool.length)];
      this.logService.createLog({
        message: `${this.name} gave ${pet.name} ${equipment.name}`,
        type: 'ability',
        player: this.parent,
        randomEvent: true,
      });
      pet.givePetEquipment(equipment, this.level);
    }
  }

  constructor(
    protected logService: LogService,
    protected toyService: ToyService,
    parent: Player,
    level: number,
    private equipmentService: EquipmentService,
  ) {
    super(logService, toyService, parent, level);
  }
}


export class PandorasBoxAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private equipmentService: EquipmentService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    equipmentService: EquipmentService,
  ) {
    super({
      name: 'PandorasBoxAbility',
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
    this.abilityService = abilityService;
    this.equipmentService = equipmentService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();
    const ailments = Array.from(
      this.equipmentService.getInstanceOfAllAilments().values(),
    );
    const perks = Array.from(equipmentMap.values()).filter(
      (equipment) => equipment,
    );
    const opponent = getOpponent(gameApi, owner.parent);
    const pets = [...owner.parent.petArray, ...opponent.petArray].filter(
      (pet) => pet?.alive,
    );
    for (const pet of pets) {
      const useAilment = Math.random() < 0.5;
      const pool = useAilment ? ailments : perks;
      if (!pool.length) {
        continue;
      }
      const baseEquipment = pool[Math.floor(Math.random() * pool.length)];
      if (!baseEquipment) {
        continue;
      }
      const perkClone = cloneEquipment(baseEquipment);
      if (!perkClone) {
        continue;
      }
      pet.givePetEquipment(perkClone, this.level);
      this.logService.createLog({
        message: `Pandoras Box Ability gave ${pet.name} ${perkClone.name}`,
        type: 'ability',
        player: owner.parent,
        tiger,
        pteranodon,
        randomEvent: true,
      });
    }

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): PandorasBoxAbility {
    return new PandorasBoxAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.equipmentService,
    );
  }
}

