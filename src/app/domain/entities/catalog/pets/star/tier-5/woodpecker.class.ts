import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class Woodpecker extends Pet {
  name = 'Woodpecker';
  tier = 5;
  pack: Pack = 'Star';
  attack = 6;
  health = 5;

  initAbilities(): void {
    this.addAbility(new WoodpeckerAbility(this, this.logService));
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


export class WoodpeckerAbility extends Ability {
  private logService: LogService;

  constructor(owner: Pet, logService: LogService) {
    super({
      name: 'WoodpeckerAbility',
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
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let triggers = this.level * 2; // L1=2, L2=4, L3=6 triggers

    for (let i = 0; i < triggers; i++) {
      // Find the nearest two pets ahead
      let targetsResp = owner.parent.nearestPetsAhead(2, owner, null, true);
      let targets = targetsResp.pets;
      for (let target of targets) {
        let power = 1;
        if (target.parent != this.owner.parent) {
          power *= 2;
        }
        owner.snipePet(target, power, targetsResp.random, tiger);
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): WoodpeckerAbility {
    return new WoodpeckerAbility(newOwner, this.logService);
  }
}


