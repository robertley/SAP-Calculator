import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class AtlanticPuffin extends Pet {
  name = 'Atlantic Puffin';
  tier = 2;
  pack: Pack = 'Custom';
  attack = 4;
  health = 3;
  initAbilities(): void {
    this.addAbility(new AtlanticPuffinAbility(this, this.logService));
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


export class AtlanticPuffinAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'AtlanticPuffinAbility',
      owner: owner,
      triggers: ['FriendAttacked'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext): boolean => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        if (!triggerPet || triggerPet.equipment?.name != 'Strawberry') {
          return false;
        }
        return true;
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
    this.logService.createLog({
      message: `${owner.name} removed ${triggerPet.name}'s ${triggerPet.equipment.name}.`,
      type: 'ability',
      player: owner.parent,
      tiger: tiger,
    });

    triggerPet.removePerk();
    let power = 2 * owner.level;
    let targetResp = owner.parent.opponent.getLastPet();
    let target = targetResp.pet;
    if (target == null) {
      return;
    }
    owner.snipePet(target, power, targetResp.random, tiger);

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): AtlanticPuffinAbility {
    return new AtlanticPuffinAbility(newOwner, this.logService);
  }
}


