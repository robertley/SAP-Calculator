import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { cloneEquipment } from 'app/runtime/equipment-clone';
import { hasAliveTriggerTarget, resolveTriggerTargetAlive } from 'app/domain/entities/ability-resolution';


export class RealVelociraptor extends Pet {
  name = 'Real Velociraptor';
  tier = 6;
  pack: Pack = 'Star';
  attack = 6;
  health = 5;

  initAbilities(): void {
    this.addAbility(new RealVelociraptorAbility(this, this.logService));
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


export class RealVelociraptorAbility extends Ability {
  private logService: LogService;
  private friendAppliedThisTurn: Set<Pet> = new Set();
  reset(): void {
    this.maxUses = this.level;
    this.friendAppliedThisTurn = new Set();
    super.reset();
  }
  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'RealVelociraptorAbility',
      owner: owner,
      triggers: ['FriendLostPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      maxUses: owner.level,
      precondition: (context: AbilityContext) => {
        const { triggerPet } = context;
        const owner = this.owner;
        if (!triggerPet || !triggerPet.lastLostEquipment) {
          return false;
        }
        if (
          !hasAliveTriggerTarget(owner, triggerPet, { excludeOwner: true })
        ) {
          return false;
        }
        const targetResp = resolveTriggerTargetAlive(owner, triggerPet);
        const target = targetResp.pet;
        return !!target && !this.friendAppliedThisTurn.has(target);
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    // Create new instance of the lost equipment
    let restoredPerk = this.createEquipmentInstance(
      triggerPet.lastLostEquipment,
    );
    if (restoredPerk) {
      let targetResp = resolveTriggerTargetAlive(owner, triggerPet);
      let target = targetResp.pet;
      if (target == null) {
        return;
      }
      target.givePetEquipment(restoredPerk);

      this.logService.createLog({
        message: `${owner.name} returned ${restoredPerk.name} to ${target.name}.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
      this.friendAppliedThisTurn.add(target);
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  /**
   * Creates a new instance of equipment based on the equipment class
   */
  private createEquipmentInstance(equipment: Equipment): Equipment | null {
    if (!equipment) {
      return null;
    }
    return cloneEquipment(equipment);
  }

  copy(newOwner: Pet): RealVelociraptorAbility {
    return new RealVelociraptorAbility(newOwner, this.logService);
  }
}






