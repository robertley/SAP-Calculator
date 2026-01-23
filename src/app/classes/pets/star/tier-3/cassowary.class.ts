import { AbilityService } from 'app/services/ability/ability.service';
import { LogService } from 'app/services/log.service';
import { Equipment } from '../../../equipment.class';
import { Pack, Pet } from '../../../pet.class';
import { Player } from '../../../player.class';
import { Ability, AbilityContext } from 'app/classes/ability.class';


export class Cassowary extends Pet {
  name = 'Cassowary';
  tier = 3;
  pack: Pack = 'Star';
  attack = 5;
  health = 2;

  initAbilities(): void {
    this.addAbility(new CassowaryAbility(this, this.logService));
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


export class CassowaryAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'CassowaryAbility',
      owner: owner,
      triggers: ['FriendGainsPerk'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return triggerPet && triggerPet.equipment?.name === 'Strawberry';
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

    const buffAmount = this.level;
    let targetResp = owner.parent.getThis(owner);
    let target = targetResp.pet;
    if (target == null) {
      return;
    }

    this.logService.createLog({
      message: `${owner.name} gave ${target.name} +${buffAmount} permanent health and +${buffAmount} attack for this battle.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    target.increaseHealth(buffAmount);
    target.increaseAttack(buffAmount);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): CassowaryAbility {
    return new CassowaryAbility(newOwner, this.logService);
  }
}
