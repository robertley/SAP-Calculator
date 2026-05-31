import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { Cowardly } from 'app/domain/entities/catalog/equipment/ailments/cowardly.class';


export class Kakapo extends Pet {
  name = 'Kakapo';
  tier = 4;
  pack: Pack = 'Danger';
  attack = 4;
  health = 4;

  initAbilities(): void {
    this.addAbility(new KakapoAbility(this, this.logService));
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


// After first attack: Make the highest attack enemy Cowardly.
export class KakapoAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'KakapoAbility',
      owner: owner,
      triggers: ['ThisFirstAttack'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.timesAttacked <= 1;
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
    const excludeTargets: Pet[] = [];
    for (let i = 0; i < this.level; i++) {
      const targetResp = owner.parent.opponent.getHighestAttackPets(
        1,
        excludeTargets,
        owner,
      );
      const target = targetResp.pets[0];
      if (!target) {
        continue;
      }
      excludeTargets.push(target);
      target.givePetEquipment(new Cowardly(this.logService));
      this.logService.createLog({
        message: `${owner.name} made ${target.name} Cowardly.`,
        type: 'ability',
        player: owner.parent,
        tiger: tiger,
        randomEvent: targetResp.random,
      });
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): KakapoAbility {
    return new KakapoAbility(newOwner, this.logService);
  }
}



