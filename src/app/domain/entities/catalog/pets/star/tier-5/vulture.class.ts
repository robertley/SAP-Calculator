import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Vulture extends Pet {
  name = 'Vulture';
  tier = 5;
  pack: Pack = 'Star';
  attack = 4;
  health = 5;

  initAbilities(): void {
    this.addAbility(
      new VultureAbility(this, this.logService, this.abilityService),
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


export class VultureAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
  ) {
    super({
      name: 'VultureAbility',
      owner: owner,
      triggers: ['PostRemovalFriendFaints2'],
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

    let opponent = owner.parent.opponent;
    let targetResp = opponent.getRandomPet([], false, true, false, owner);
    if (targetResp.pet == null) {
      return;
    }
    let power = this.level * 4;
    owner.snipePet(targetResp.pet, power, targetResp.random, tiger);
    this.logService.createLog({
      message: `${owner.name} sniped ${targetResp.pet.name} for ${power} after a friend died.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });
    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): VultureAbility {
    return new VultureAbility(newOwner, this.logService, this.abilityService);
  }
}



