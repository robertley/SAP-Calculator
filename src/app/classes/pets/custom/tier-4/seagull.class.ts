import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { PetService } from 'app/services/pet/pet.service';
import { GameService } from 'app/services/game.service';
import { Ability, AbilityContext } from 'app/classes/ability.class';
import { EquipmentService } from 'app/services/equipment/equipment.service';
import { InjectorService } from 'app/services/injector.service';
import { logAbility, resolveFriendSummonedTarget } from 'app/classes/ability-helpers';


export class Seagull extends Pet {
  name = 'Seagull';
  tier = 4;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new SeagullAbility(this, this.logService));
    super.initAbilities();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
    protected gameService: GameService,
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


export class SeagullAbility extends Ability {
  private logService: LogService;
  private usesThisTurn = 0;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'SeagullAbility',
      owner: owner,
      triggers: ['FriendSummoned', 'StartTurn'],
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
    const { triggerPet, tiger, pteranodon, trigger } = context;
    const owner = this.owner;

    if (trigger === 'StartTurn') {
      this.usesThisTurn = 0;
      return;
    }

    const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
    if (
      !targetResp.pet ||
      !owner.equipment ||
      this.usesThisTurn >= this.level
    ) {
      this.triggerTigerExecution(context);
      return;
    }

    const equipmentService =
      InjectorService.getInjector().get(EquipmentService);
    const baseEquipment = owner.equipment;
    const equipmentInstance = equipmentService
      .getInstanceOfAllEquipment()
      .get(baseEquipment.name);

    if (!equipmentInstance) {
      this.triggerTigerExecution(context);
      return;
    }

    const target = targetResp.pet;
    target.givePetEquipment(equipmentInstance);
    this.usesThisTurn++;

    logAbility(
      this.logService,
      owner,
      `${owner.name} gave ${target.name} a ${baseEquipment.name}`,
      tiger,
      pteranodon,
      { randomEvent: targetResp.random },
    );

    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SeagullAbility {
    return new SeagullAbility(newOwner, this.logService);
  }
}

